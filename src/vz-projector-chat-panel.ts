/* Copyright 2016 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {customElement, observe, property} from '@polymer/decorators';
import {PolymerElement, html} from '@polymer/polymer';
import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin';
import {format} from 'date-fns';
import './polymer/irons_and_papers';

type ChatMessage = {
  author: string;
  text: string;
  created: number;
};

@customElement('chat-window')
class ChatWindow extends LegacyElementMixin(PolymerElement) {
  static readonly template = html`
    <style>
      :host {
        /* display: block; */
      }
      .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        @apply --chat-window;
      }
      chat-messages {
        flex: 1;
        @apply --chat-window-messages;
      }
      chat-input {
        background: var(--grayEE);
        @apply --chat-window-input;
      }
    </style>

    <div class="container">
      <slot name="chat-header"></slot>
      <chat-messages
        author="[[author]]"
        author-icon="[[authorIcon]]"
        others-icons="[[othersIcons]]"
        default-icon="[[defaultIcon]]"
        messages="[[messages]]"
        date-format="[[dateFormat]]"
        auto-scroll="[[autoScroll]]"
      >
      </chat-messages>
      <slot name="chat-footer"></slot>
      <slot name="chat-input"></slot>
      <template is="dom-if" if="[[!_hasCustomInput()]]">
        <chat-input
          single-line="[[singleLine]]"
          icon="[[sendIcon]]"
          text="{{inputText}}"
          send-on-enter="[[sendOnEnter]]"
        ></chat-input>
      </template>
    </div>
  `;

  @property({type: Boolean, reflectToAttribute: true})
  singleLine: boolean = false;
  @property({type: String, notify: true})
  inputText!: string;
  @property({type: Array})
  messages: ChatMessage[] = [];
  @property({type: String})
  author: string;
  @property({type: String})
  sendIcon: string = 'send';
  @property({type: Boolean})
  sendOnEnter: boolean;
  @property({type: Boolean})
  autoScroll: boolean = true;
  @property({type: String})
  dateFormat: string;
  @property({type: String})
  authorIcon: string = 'account-circle';
  @property({type: Object})
  othersIcon: any;
  @property({type: String})
  defaultIcon: string = 'android';

  _hasCustomInput(): boolean {
    return false;
    // let distributed = this.childNodes;
    // for (let i = 0; i < distributed.length; i++) {
    //   if (distributed[i].slot == 'chat-input') return true;
    // }
    // return false;
  }
}

@customElement('chat-messages')
class ChatMessages extends LegacyElementMixin(PolymerElement) {
  static readonly template = html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }
      #scroller {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: var(--chat-messages-height, 5em);
        overflow: auto;
        padding-right: 4px;
        height: 100%;
        @apply --chat-messages-scroller;
      }
      .message {
        margin: 2px;
        @apply --layout-vertical;
        @apply --chat-message;
      }

      from-now {
        font-size: small;
        color: gray;
        @apply --layout-self-center;
        @apply --chat-message-time;
      }
      .text-container {
        @apply --layout-horizontal;
        @apply --chat-message-text-container;
      }

      .text-container.me {
        @apply --layout-horizontal-reverse;
        @apply --layout-end;
        @apply --chat-message-text-container-me;
      }

      .text-container.not-me {
        @apply --layout-horizontal;
        @apply --chat-message-text-container-not-me;
      }
      .text {
        overflow-wrap: break-word;
        max-width: 80%;
        padding: 6px 8px;
        margin: 4px 0;
        border-radius: 1rem;
        @apply --chat-message-text;
      }
      .me .text {
        background-color: #388cf9;
        color: white;
        @apply --layout-self-end;
        @apply --chat-message-text-me;
      }
      .not-me .text {
        background-color: var(--grayE9);
        color: black;
        @apply --layout-self-start;
        @apply --chat-message-text-not-me;
      }
      .code {
        font: 0.6rem monospace;
        white-space: pre-wrap;
      }
      iron-icon {
        --iron-icon-height: 24px;
        --iron-icon-width: 24px;
      }
      .me iron-icon {
        margin-left: 5px;
        @apply --chat-message-icon-me;
      }
      .not-me iron-icon {
        margin-right: 5px;
        @apply --chat-message-icon-not-me;
      }
    </style>

    <div id="scroller">
      <template is="dom-repeat" items="[[messages]]" as="msg">
        <div class="message">
          <from-now
            time="[[msg.created]]"
            idle="[[!_indexesContains(_indexes, index, showAllTimestamps)]]"
            hidden$="[[!_indexesContains(_indexes, index, showAllTimestamps)]]"
          >
          </from-now>
          <div class$="[[_classForAuthor(msg.author)]] text-container">
            <iron-icon
              icon="[[_getIcon(msg.author)]]"
              src="[[_getSrc(msg.author)]]"
            >
            </iron-icon>
            <div class="text" title="[[_formatTimestamp(msg.created)]]">
              <template is="dom-repeat" items="[[_messageLines(msg.text)]]">
                <span class$="[[item.class]]">[[item.line]]</span><br />
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  `;

  @property({type: String})
  author: string;
  @property({type: String})
  authorIcon: string = 'account-circle';
  @property({type: Array})
  messages: ChatMessage[] = [];
  @property({type: Boolean})
  showAllTimestamps: boolean = false;
  @property({type: Boolean})
  autoScroll: boolean = true;
  @property({type: String})
  dateFormat: string;
  @property({type: Object})
  othersIcons: any;
  @property({type: String})
  defaultIcon: string = 'face';

  _classForAuthor(author: string) {
    return author == this.author ? 'me' : 'not-me';
  }

  @observe('messages.*', 'showAllTimestamps')
  _messagesChanged(changeData, showAllTimestamps) {
    // console.log('msg changed', changeData);
    this.debounce(
      'messages-changed',
      function () {
        if (changeData && changeData.base && changeData.base.length > 0) {
          if (this.autoScroll) {
            this.scrollToBottom();
          }
          if (!showAllTimestamps)
            this._updateTimestampedIndexes(changeData.base);
        }
      }.bind(this),
      250
    );
  }

  _indexesContains(indexes, index, showAllTimestamps) {
    return showAllTimestamps || (indexes && indexes.includes(index));
  }

  _updateTimestampedIndexes(messages) {
    // console.log('updating indexes...', messages)
    var indexes = [0];
    var i,
      age,
      between,
      now = Date.now();
    for (i = 1; i < messages.length; i++) {
      age = now - messages[i].created;
      between = messages[i].created - messages[i - 1].created;
      // console.log('index', i, 'age', age, 'between', between);
      if (this._shouldBeTimestamped(age, between)) {
        indexes.push(i);
      }
    }
    // this._indexes = indexes;
    // console.log('indexes', this._indexes);
  }

  _shouldBeTimestamped(age, between) {
    if (age < 60 * 60 * 1000) {
      // If less than one hour old,
      return between > 5 * 60 * 1000; // show every 5 minutes.
    } else if (age < 24 * 60 * 60 * 1000) {
      // If less than one day old,
      return between > 60 * 60 * 1000; // show every hour.
    } else if (age < 7 * 24 * 60 * 60 * 1000) {
      // If less than a week old,
      return between > 4 * 60 * 60 * 1000; // show every four hours.
    } else {
      // If a week or older,
      return between > 24 * 60 * 60 * 1000; // show once per day.
    }
  }

  _formatTimestamp(time: number) {
    return format(time || Date.now(), this.dateFormat || 'hh:mmaaa');
  }

  scrollToBottom() {
    setTimeout(
      function () {
        var target = this.$.scroller;
        target.scrollTop = target.scrollHeight;
        if (target.scrollTop != target.scrollHeight) {
          console.debug('Failed to set scrollTop on target');
        }
      }.bind(this),
      100
    );
  }

  _getIcon(author) {
    if (author == this.author) {
      return this._iconIsUrl(this.authorIcon) ? '' : this.authorIcon;
    } else if (this.othersIcons && this.othersIcons[author]) {
      return this._iconIsUrl(this.othersIcons[author])
        ? ''
        : this.othersIcons[author];
    } else {
      return this._iconIsUrl(this.defaultIcon) ? '' : this.defaultIcon;
    }
  }

  _getSrc(author) {
    if (author == this.author) {
      return this._iconIsUrl(this.authorIcon) ? this.authorIcon : '';
    } else if (this.othersIcons && this.othersIcons[author]) {
      return this._iconIsUrl(this.othersIcons[author])
        ? this.othersIcons[author]
        : '';
    } else {
      return this._iconIsUrl(this.defaultIcon) ? this.defaultIcon : '';
    }
  }

  _iconIsUrl(icon) {
    return icon && (icon.includes('/') || icon.includes('.'));
  }
  _messageLines(msg: string) {
    if (!msg) return [];
    return msg.trim().split(/\r?\n/).map((line) => ({
      class: /^[+|]/.test(line) ? 'code' : undefined,
      line: line,
    }));
  }
}

@customElement('chat-input')
class ChatInput extends PolymerElement {
  static readonly template = html`
    <style>
      :host {
        display: block;
        @apply --layout-horizontal;
        @apply --layout-center;
      }
      paper-input,
      paper-textarea {
        margin: 4px;
        @apply --layout-flex;
        @apply --chat-input-input;
      }
      paper-icon-button {
        color: var(--primary-color);
        height: 36px;
        width: 36px;
        @apply --chat-icon-button;
      }
    </style>
    <paper-input
      no-label-float
      hidden$="[[!singleLine]]"
      value="{{text}}"
      on-keydown="_checkForEnter"
    >
    </paper-input>
    <paper-textarea
      no-label-float
      hidden$="[[singleLine]]"
      value="{{text}}"
      on-keydown="_checkForEnter"
    >
    </paper-textarea>
    <paper-icon-button
      noink
      icon="[[_getIcon(icon)]]"
      src="[[_getSrc(icon)]]"
      on-tap="_fireSendEvent"
    ></paper-icon-button>
  `;

  @property({type: Boolean})
  singleLine: boolean = false;
  @property({type: String, notify: true})
  text: string;
  @property({type: String})
  icon: string = 'send';
  @property({type: Boolean})
  sendOnEnter: boolean;

  _fireSendEvent() {
    // console.log('firing send event...', this.text);
    this.dispatchEvent(
      new CustomEvent<string>('send', {
        detail: this.text,
        bubbles: true,
        composed: true,
      })
    );
  }

  _getIcon(icon) {
    return this._iconIsUrl(icon) ? '' : icon;
  }

  _getSrc(icon) {
    return this._iconIsUrl(icon) ? icon : '';
  }

  _iconIsUrl(icon: string) {
    return icon && (icon.includes('/') || icon.includes('.'));
  }

  _checkForEnter(e) {
    if (
      e.keyCode === 13 &&
      (this.sendOnEnter || (this.sendOnEnter === undefined && this.singleLine))
    ) {
      this._fireSendEvent();
    }
  }
}

@customElement('vz-projector-chat-panel')
class ChatPanel extends PolymerElement {
  static readonly template = html`
    <style include="vz-projector-styles"></style>
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }
      .title {
        align-items: center;
        border-bottom: 1px solid var(--blackAlpha13);
        color: var(--black);
        display: flex;
        font-weight: 500;
        height: 59px;
        min-height: 59px;
        padding-left: 20px;
      }
      chat-window {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    </style>
    <div class="title">AI CHAT</div>
    <chat-window
      id="chat"
      author="me"
      messages="[[messages]]"
      on-send="_queryAi"
      input-text="{{inputText}}"
      single-line
    ></chat-window>
  `;

  @property({type: String})
  chatbotUrl: string;

  inputText: string = '';

  messages: ChatMessage[] = [
    {author: 'AI', text: "What's on your mind?", created: Date.now() },
  ];

  async _queryAi(e: any) {
    const query = e.detail;
    this.push('messages', { author: 'me', text: query, created: Date.now() });
    this.inputText = '';
    console.log("Sending to AI (%s): %o", this.chatbotUrl, query);

    const formData = new FormData();
    formData.append('question', query);
    const response = await fetch(this.chatbotUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.log("AI error %o", response);
      this.push('messages', { author: 'AI', text: `Server error: ${response.status}`, created: Date.now() });
    } else {
      const body = await response.json();
      console.log("AI response: %o", body);
      const data = body.data || {};
      const query = data.executed_query;
      const dataset = data.data_frame;
      const reply = `${query}\n\n${dataset}`;
      this.push('messages', { author: 'AI', text: reply, created: Date.now() });
    }
  }
}
