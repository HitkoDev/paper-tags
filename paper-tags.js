import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-badge/paper-badge.js';
import '../@polymer/paper-icon-button/paper-icon-button.js';
import '../@polymer/iron-icons/iron-icons.js';
import '../@polymer/iron-icon/iron-icon.js';
import './paper-tags-behavior.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="paper-tags">
  <style>
  [hidden] {
    display: none !important;
  }

  :host {
    display: block;
    @apply(--paper-font-common-base);
    @apply(--paper-tags);
  }
  
  div.paper-tag-item {
    margin-bottom: var(--paper-tag-margin, 3px);
    border: 1px solid var(--paper-tag-focus-color, --default-primary-color);
    font-size: 13px;
    color: var(--paper-tag-text-color, --secondary-text-color);
    border-radius: 4px;
    @apply(--paper-tag-item);
  }
  
  .paper-tag-item:last-of-type {
    margin-right: var(--paper-tag-margin, 3px);
  }
  
  paper-icon-button {
    color: var(--paper-tag-focus-color, --default-primary-color);
    width: 20px;
    height: 20px;
    padding: 0;
  }
  
  .paper-tag-item-label {
    padding: var(--paper-tag-margin, 3px);
  }
  
  .paper-tag-item {
    display: inline-block;
  }
  </style>
  <template>
    <template is="dom-repeat" id="tagRepeat" items="[[items]]">
      <div class\$="paper-tag-item [[_computeClass(item, classAccessor)]]">
        <span class="paper-tag-item-label">[[_computeLabel(item, labelPath)]]</span>
        <paper-icon-button icon="icons:close" hidden\$="[[preventRemoveTag]]" on-tap="_removeTag"></paper-icon-button>
        <paper-icon-button icon="[[_computeIcon(item, iconAccessor)]]" hidden\$="[[!preventRemoveTag]]"></paper-icon-button>
      </div>
    </template>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({

  is: 'paper-tags',

  behaviors: [
    Polymer.PaperTagsBehavior
  ],

  properties: {

    /**
     * `readonly`prevents tags to be removed
     */
    readonly: Boolean,

    /**
     * `items` the Array of tags
     */
    items: {
      type: Array,
      notify: true,
      value: function () {
        return [];
      }
    }
  },

  _computeIcon: function (item, iconAccessor) {
    return item[iconAccessor] || this.icon;
  },

  _computeClass: function (item, classAccessor) {
    return item[classAccessor] || this.itemClass;
  },

  _computeLabel: function (item, labelPath) {
    return item[labelPath] || item;
  },

  _removeTag: function (event) {
    if (this.readonly) {
      return;
    }
    event.detail.isRemoved = true;
    var model = event.model,
      index = this.items.indexOf(model.item);

    if (index > -1) {
      event.stopPropagation();
      this.debounce('paper-tag-remove-item', function () {
        this.splice('items', index, 1);
      }, 10);
      // this.items = this.items.slice();
      // this.fire('tag-removed', model.item);
    }
  }
});
