import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import '../@polymer/paper-input/paper-input.js';
import './paper-tags.js';
import './paper-tags-behavior.js';
Polymer({
  _template: `
    <style>
    :host {
      display: block;
      --paper-tag-margin: 3px;
    }

    paper-input {
      --paper-input-container-input: {
        margin-bottom: var(--paper-tag-margin);
      }
    }

    paper-tags {
      max-width: 80%;
    }

    paper-tags[readonly] {
      opacity: 0.6;
    }

    paper-badge {
      display: inline-block;
      position: inherit;
    }

    .paper-tags-counter {
      display: inline-block;
    }
    </style>
    <paper-input id="tagInput" always-float-label="" on-keydown="_keyDown" readonly\$="[[readonly]]" placeholder\$="[[placeholder]]" disabled\$="[[disabled]]" invalid="[[invalid]]" label="[[label]]" value="{{value}}" maxlength\$="[[maxlength]]" error-message="[[errorMessage]]" minlength\$="[[minlength]]">
      <content select="[prefix]" slot="prefix"></content>
      <paper-tags id="paperTags" readonly\$="[[readonly]]" items="{{items}}" icon="[[icon]]" item-class="[[itemClass]]" class-accessor="[[classAccessor]]" label-path="[[labelPath]]" icon-accessor="[[iconAccessor]]" prevent-remove-tag="[[preventRemoveTag]]" slot="prefix"></paper-tags>
      <content select="[suffix]" slot="suffix"></content>
    </paper-input>
    <template is="dom-if" if="{{showCounter}}">
      <div class="paper-tags-counter">
        <paper-badge class="paper-tags-badge" label="[[items.length]]"></paper-badge> [[showCounter]]
      </div>
    </template>
`,

  is: 'paper-tags-input',

  behaviors: [
    Polymer.PaperTagsBehavior
  ],

  properties: {
    /**
     * `preventRemoveTag` hide the `close` icon and prevent removing a tag when true.
     */
    preventRemoveTag: {
      type: Boolean,
      value: false
    },

    /**
     * `items` the Array of tags
     */
    items: {
      type: Array,
      notify: true
    },
    /**
     * `delimiter` defaults to comma (,)
     */
    delimiter: {
      type: String,
      value: ','
    },
    /**
     * `showCounter` display a paper-badge with `showCounter` as textContent
     */
    showCounter: String,

    /**
     * `maxTags` The maximum allowed number of tags (yet to be implemented)
     */
    maxTags: Number,

    /**
     * `minTags` The minimum allowed number of tags (yet to be implemented)
     */
    minTags: Number,

    /**
     * `tagTpl` a template Object used when creating new tags. If not defuned, new tags will jus be Strings
     */
    tagTpl: Object,

    /**
     * `value` the underlying paper-input value
     */
    value: {
      type: String,
      notify: true
    },

    /**
     * `allowAdd` determines if new tags are allowed on pressing `Enter` or not.
     */
    allowAdd: {
      type: Boolean,
      value: true
    }
  },

  observers: [
    '_observeTagItemsInit(items)',
    '_observeTagItems(items.splices)'
  ],

  _observeTagItemsInit: function (items) {
    if (items && !this.valueArray) {
      this._observeTagItems(items)

    }

  },

  _observeTagItems: function (splices) {
    if (!splices) {
      return
    }
    var keys = [];
    this._isUpdatingingItems = true;
    this.items.forEach(function (item) {
      var id = item[this.keyPath] || item;
      keys.push(id + '');
    }, this);

    this.syncValueArrayWithKeys(keys)

    delete this._isUpdatingingItems;
  },

  _removeLast: function () {
    var last = this.items.pop();
    this.items = this.items.slice();
    // this.fire('tag-removed', last);
  },

  findTag: function (tag) {
    return this.items.includes(tag);
  },

  _addTag: function (tag) {
    if (this.tagTpl) {
      var id = tag;
      tag = JSON.parse(JSON.stringify(this.tagTpl));
      tag[this.keyPath] = id + '';
      if (this.labelPath) {
        tag[this.labelPath] = id;
      }
    }
    this.push('items', tag);
    this.items = this.items.slice();
    // this.fire('tag-added', tag);
  },

  _keyDown: function (event) {
    var keyVal = event.which;
    if (keyVal === 13 && this.allowAdd) {
      var tags = event.target.value.split(this.delimiter);
      var me = this;

      tags.forEach(function (tag) {
        if (!me.findTag(tag)) {
          me._addTag(tag);
          event.target.value = '';
        }
      });

    } else if (keyVal === 8 && event.target.value === '') {
      this._removeLast();
    }
  },

  /**
   * Returns a reference to the focusable element.
   */
  get _focusableElement() {
    return this.$.tagInput.inputElement;
  }
});
