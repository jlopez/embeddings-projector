/* Copyright 2020 The TensorFlow Authors. All Rights Reserved.

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

import {customElement, property} from '@polymer/decorators';
import {html, PolymerElement} from '@polymer/polymer';
import '../../../components/polymer/irons_and_papers';
import './styles';
import './vz-projector';

@customElement('vz-projector-app')
class VzProjectorApp extends PolymerElement {
  static readonly template = html`
    <style include="vz-projector-styles"></style>
    <style>
      #appbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        height: 60px;
        color: var(--white);
        background: var(--mulberryWood);
      }

      #appbar .logo {
        font-size: 18px;
        font-weight: 300;
      }

      .icons {
        display: flex;
      }

      .icons a {
        color: var(--white);
      }

      vz-projector {
        height: calc(100% - 60px);
      }

      #container {
        height: 100%;
      }
    </style>

    <div id="container">
      <div id="appbar">
        <div>Embedding Projector</div>
        <div class="icons">
          <a
            title="Documentation"
            target="_blank"
            href="[[documentationLink]]"
            rel="noopener noreferrer"
          >
            <paper-icon-button icon="help-outline"></paper-icon-button>
            <paper-tooltip
              position="bottom"
              animation-delay="0"
              fit-to-visible-bounds=""
            >
              Open documentation
            </paper-tooltip>
          </a>
          <a
            title="Report bug"
            target="_blank"
            href="[[bugReportLink]]"
            rel="noopener noreferrer"
          >
            <paper-icon-button icon="bug-report"></paper-icon-button>
            <paper-tooltip
              position="bottom"
              animation-delay="0"
              fit-to-visible-bounds=""
            >
              Report a bug
            </paper-tooltip>
          </a>
          <paper-icon-button
            icon="settings"
            on-click="openSettings"
          ></paper-icon-button>
          <paper-tooltip
            position="bottom"
            animation-delay="0"
            fit-to-visible-bounds=""
          >
            Configure Projector Settings
          </paper-tooltip>
        </div>
      </div>
      <vz-projector
        route-prefix="[[routePrefix]]"
        serving-mode="[[servingMode]]"
        projector-config-json-path="[[projectorConfigJsonPath]]"
        page-view-logging="[[pageViewLogging]]"
        event-logging="[[eventLogging]]"
      >
      </vz-projector>
      <div>
        <paper-dialog id="settingsDialog" with-backdrop>
          <h2>Embedding Projector Settings</h2>
          <paper-dialog-scrollable class="scrollable-container">
            <h4>Generator Settings</h4>
            <paper-input
              id="generator-url"
              label="Image Generator URL"
              value="{{generatorUrl}}"
            ></paper-input>
          </paper-dialog-scrollable>
          <div class="dismiss-dialog-note">Click outside to dismiss.</div>
        </paper-dialog>
      </div>
    </div>
  `;
  @property({type: Boolean})
  pageViewLogging: boolean = false;
  @property({type: Boolean})
  eventLogging: boolean = false;
  @property({type: String})
  projectorConfigJsonPath: string = '';
  @property({type: String})
  routePrefix: string = '';
  @property({type: String})
  servingMode: string = '';
  @property({type: String})
  documentationLink: string = '';
  @property({type: String})
  bugReportLink: string = '';
  generatorUrl: string = 'https://httpbin.org/post';

  openSettings(): void {
    (this.$.settingsDialog as any).open();
  }
}
