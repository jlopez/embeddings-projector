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

import {html} from '@polymer/polymer';
import '../../../components/polymer/irons_and_papers';
import './styles';

export const template = html`
  <style include="vz-projector-styles"></style>
  <style>
    #title {
      background-color: var(--grayFA);
      color: var(--black);
      font-weight: 500;
      left: 0;
      line-height: 60px;
      padding-left: 24px;
      position: absolute;
      width: 276px;
    }
    #bookmark-container {
      background-color: var(--grayFA);
    }
    #icon-container {
      line-height: 60px;
      position: absolute;
      right: 0;
    }
    #header {
      border-top: 1px solid var(--blackAlpha13);
      position: relative;
    }
    #panel {
      background-color: var(--grayFA);
      position: relative;
      overflow-y: scroll;
      top: 60px;
      max-height: 50vh;
    }

    #save-container {
      text-align: center;
    }

    .state-radio {
      display: table-cell;
      vertical-align: middle;
      padding-top: 16px;
    }

    .state-label {
      display: table-cell;
      vertical-align: middle;
      top: 14px;
    }

    .state-label-input {
      width: 194px;
    }

    .state-clear {
      display: table-cell;
      vertical-align: middle;
      padding-top: 20px;
    }
    #state-file {
      display: none;
    }
    #no-bookmarks {
      padding: 0 24px;
    }
    #action-buttons-container .add-icon-button {
      background-color: var(--democrat);
      color: var(--white);
      margin: 0 4px 4px auto;
      right: 7px;
      top: -4px;
    }
    .upload-download-icon-button {
      padding: 0;
    }
    #action-buttons-container {
      display: flex;
      margin-left: 34px;
      margin-top: 6px;
    }
    .ink-fab {
      border-radius: 50%;
      background: var(--white);
      box-shadow: 0 1px 3px var(--blackAlpha4C);
    }
    paper-textarea {
      --paper-input-container-input: {
        font-size: 12px;
      }
      --paper-font-caption: {
        display: none;
      }
    }
  </style>

  <!-- Bookmarking controls -->
  <div id="bookmark-container">
    <div id="header">
      <div id="title">
        BOOKMARKS ([[savedStates.length]])
        <paper-icon-button icon="help" class="help-icon"></paper-icon-button>
        <paper-tooltip animation-delay="0" position="top" offset="0">
          Open this drawer to save a set of views of the projection, including
          selected points. A file containing the bookmarks can then be saved and
          later loaded to view them.
        </paper-tooltip>
      </div>
      <div id="icon-container">
        <!-- Icons and event handlers are inverted because the tray expands upwards. -->
        <paper-icon-button
          id="expand-more"
          icon="expand-less"
          on-tap="_expandMore"
        ></paper-icon-button>
        <paper-icon-button
          id="expand-less"
          style="display: none"
          icon="expand-more"
          on-tap="_expandLess"
        ></paper-icon-button>
      </div>
    </div>
    <iron-collapse id="panel">
      <!-- Saving state section -->
      <div id="state-section">
        <template is="dom-if" if="[[!savedStates.length]]">
          <p id="no-bookmarks">
            No bookmarks yet, upload a bookmarks file or add a new bookmark by
            clicking the "+" below.
          </p>
        </template>

        <template is="dom-repeat" items="{{savedStates}}">
          <div class="state-row">
            <div class="state-radio">
              <template is="dom-if" if="{{item.isSelected}}">
                <paper-icon-button
                  icon="radio-button-checked"
                ></paper-icon-button>
              </template>
              <template is="dom-if" if="{{!item.isSelected}}">
                <paper-icon-button
                  icon="radio-button-unchecked"
                  data-index$="{{index}}"
                  on-tap="_radioButtonHandler"
                ></paper-icon-button>
              </template>
            </div>
            <div class="state-label">
              <paper-textarea
                value="[[item.label]]"
                class="state-label-input"
                on-keyup="_labelChange"
                data-index$="[[index]]"
                autoresizing
              ></paper-textarea>
            </div>
            <div class="state-clear">
              <paper-icon-button
                icon="clear"
                data-index$="{{index}}"
                on-tap="_clearButtonHandler"
              ></paper-icon-button>
            </div>
          </div>
        </template>

        <div id="action-buttons-container">
          <paper-icon-button
            class="upload-download-icon-button"
            icon="save"
            title="Save bookmarks"
            disabled="[[!hasStates]]"
            on-tap="_downloadFile"
          ></paper-icon-button>
          <paper-icon-button
            class="upload-download-icon-button"
            icon="file-upload"
            title="Load bookmarks"
            on-tap="_uploadFile"
          ></paper-icon-button>
          <paper-icon-button
            class="add-icon-button ink-fab"
            icon="add"
            title="Add bookmark"
            on-tap="_addBookmark"
          ></paper-icon-button>
          <input type="file" id="state-file" name="state-file" />
        </div>
      </div>
    </iron-collapse>
  </div>
`;
