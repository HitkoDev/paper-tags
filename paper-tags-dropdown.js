import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import '../@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../@polymer/iron-behaviors/iron-button-state.js';
import '../@polymer/iron-behaviors/iron-control-state.js';
import '../@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import '../@polymer/iron-icon/iron-icon.js';
import '../@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import '../@polymer/paper-input/paper-input.js';
import '../@polymer/paper-menu-button/paper-menu-button.js';
import '../@polymer/paper-menu/paper-menu.js';
import '../@polymer/paper-item/paper-item.js';
import '../@polymer/paper-ripple/paper-ripple.js';
import '../@polymer/paper-styles/default-theme.js';
import '../@polymer/paper-dropdown-menu/paper-dropdown-menu-icons.js';
import '../@polymer/paper-dropdown-menu/paper-dropdown-menu-shared-styles.js';
import './paper-tags-input.js';

Polymer({
  _template: `
    <style include="paper-dropdown-menu-shared-styles">
    :host: {
      display: block;
    }

    #filterCt {
      color: var(--default-primary-color);
      padding: 2px 8;
    }

    paper-menu {
      min-width: 150px;
      @apply(--paper-menu);
    }
    </style>
    <!-- this div fulfills an a11y requirement for combobox, do not remove -->
    <div role="button"></div>
    <paper-menu-button id="menuButton" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" vertical-offset="[[_computeMenuVerticalOffset(noLabelFloat)]]" disabled="[[disabled]]" no-animations="[[noAnimations]]" opened="{{opened}}">
      <div class="dropdown-trigger">
        <paper-ripple></paper-ripple>
        <!-- paper-input has type="text" for a11y, do not remove -->
        <iron-a11y-keys id="a11y" target="[[keyTarget]]" keys="[[_computeKeys()]]" on-keys-pressed="_onAscii"></iron-a11y-keys>
        <paper-tags-input max-tags="[[maxTags]]" prevent-remove-tag="[[preventRemoveTag]]" min-tags="[[minTags]]" id="tagInput" value-object="{{valueObject}}" value-array="{{valueArray}}" on-tap="_onTagTap" tag-tpl="[[tagTpl]]" items="[[tagItems]]" value="{{value}}" icon="[[icon]]" item-class="[[itemClass]]" class-accessor="[[classAccessor]]" label-path="[[labelPath]]" icon-accessor="[[iconAccessor]]" key-path="[[keyPath]]" invalid="[[invalid]]" readonly="[[readonly]]" disabled="[[disabled]]" placeholder="[[placeholder]]" error-message="[[errorMessage]]" label="[[label]]" show-counter="[[showCounter]]">
          <iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="suffix"></iron-icon>
        </paper-tags-input>
      </div>
      <paper-menu class="dropdown-content" disabled="[[disabled]]" selected-values="{{valueArray}}" attr-for-selected="name" multi="">
        <div id="filterCt" hidden\$="[[!searchString]]">
          <span>filter:  {{searchString}}</span>
        </div>
        <template is="dom-repeat" items="[[items]]" filter="{{_computeFilter(searchString)}}">
          <paper-item name="[[_computeItemValue(item, keyPath)]]">[[_computeItemLabel(item, labelPath)]]</paper-item>
        </template>
      </paper-menu>
      <content id="content" select=".dropdown-content"></content>
    </paper-menu-button>
`,

  is: 'paper-tags-dropdown',

  behaviors: [
    Polymer.IronButtonState,
    Polymer.IronControlState,
    Polymer.IronFormElementBehavior,
    Polymer.IronValidatableBehavior
  ],

  properties: {

    /**
     * `valueObject` store value as object keys `{"value1": true, "value2": true}`
     */
    valueObject: {
      type: Object,
      notify: true,
      observer: '_observeValueArray'
    },

    /**
     * `valueArray` store value as array `["value1", "value2"]`
     */
    valueArray: {
      type: Array,
      notify: true,
    },

    keyPath: {
      type: String,
      value: 'id'
    },

    labelPath: {
      type: String,
      value: 'label'
    },


    searchString: {
      type: String,
      value: ''
    },

    items: {
      type: Array,
      value: function () {
        return [];
      }
    },

    tagItems: {
      type: Array
    },

    /**
     * When true, `showCounter` display a counter counting the number of tags
     */
    showCounter: {
      type: String
    },

    /*
     * `maxTags` the maximum allowed number of tags
     */
    maxTags: {
      type: Number
    },

    /*
     * `minTags` the minimum allowed number of tags
     */
    minTags: {
      type: Number
    },

    /*
     * `readonly` - reflects to `disabled` when set to true.
     */
    readonly: {
      type: Boolean,
      observer: '_observeReadonly'
    },

    /**
     * `tagTpl` a template Object used when creating new tags (e.g. '{"id":null, "label":"hello"}'). If not defuned, new tags will jus be Strings
     */
    tagTpl: {
      type: Object
    },

    keyTarget: {
      type: Object,
      value: function () {
        return this.$.tagInput;
      }
    },

    /**
     * The derived "label" of the currently selected item. This value
     * is the `label` property on the selected item if set, or else the
     * trimmed text content of the selected item.
     */
    selectedItemLabel: {
      type: String,
      notify: true,
      readOnly: true
    },

    /**
     * The label for the dropdown.
     */
    label: {
      type: String
    },

    /**
     * The placeholder for the dropdown.
     */
    placeholder: {
      type: String
    },

    /**
     * The error message to display when invalid.
     */
    errorMessage: {
      type: String
    },

    /**
     * True if the dropdown is open. Otherwise, false.
     */
    opened: {
      type: Boolean,
      notify: true,
      value: false,
      observer: '_openedChanged'
    },

    /**
     * Set to true to disable the floating label. Bind this to the
     * `<paper-input-container>`'s `noLabelFloat` property.
     */
    noLabelFloat: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Set to true to always float the label. Bind this to the
     * `<paper-input-container>`'s `alwaysFloatLabel` property.
     */
    alwaysFloatLabel: {
      type: Boolean,
      value: false
    },

    /**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */
    noAnimations: {
      type: Boolean,
      value: false
    },

    /**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */
    horizontalAlign: {
      type: String,
      value: 'right'
    },

    /**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */
    verticalAlign: {
      type: String,
      value: 'top'
    }
  },

  listeners: {
    'tap': '_onTap'
  },

  keyBindings: {
    'up down': 'open',
    'esc': 'close'
  },

  hostAttributes: {
    role: 'combobox',
    'aria-autocomplete': 'none',
    'aria-haspopup': 'true'
  },

  observers: [
    '_observeItems(items)',
    '_observeValueArray(valueArray.splices)',
  ],

  _observeReadonly: function (readonly, old) {
    if (readonly) {
      this.disabled = true;
      // remember that disabled property depends on readonly for run-time changes
      this._disabledFromReadonly = true;
      return;
    }
    if (old && readonly === false && this._disabledFromReadonly) {
      this.disabled = false;
    }
  },

  _observeItems: function (items) {
    // run every time item is set ore reset
    if (items) {
      this._isInitiatingItems = true;
      this.set('tagItems', this._filterValueItems(this.valueArray));

      delete this._isInitiatingItems;
    }
  },

  _observeValueArray: function (splices) {
    // run on any change to the valueArray
    this.set('tagItems', this._filterValueItems(this.valueArray));
  },

  _filterValueItems: function (valueArray) {
    var filteredVals = [];
    if (valueArray && this.items && this.items.length > 0) {
      filteredVals = this.items.filter(function (item) {
        var itemKey = this.keyPath;
        if (item[itemKey]) {
          return this.valueArray.indexOf(item[itemKey] + '') > -1;
        } else {
          return this.valueArray.indexOf(item) > -1;
        }
      }, this);
    }
    return filteredVals;
  },

  ready: function () {
    this.$.menuButton.ignoreSelect = true;
    this.$.tagInput.allowAdd = false;
    if (this.valueObject && !this.valueArray) {
      this.set('valueArray', Object.keys(this.valueObject));
    }
  },

  attached: function () {
    // NOTE(cdata): Due to timing, a preselected value in a `IronSelectable`
    // child will cause an `iron-select` event to fire while the element is
    // still in a `DocumentFragment`. This has the effect of causing
    // handlers not to fire. So, we double check this value on attached:
    var contentElement = this.contentElement;
    if (contentElement && contentElement.selectedItem) {
      this._setSelectedItem(contentElement.selectedItem);
    }
  },

  /**
   * The content element that is contained by the dropdown menu, if any.
   */
  get contentElement() {
    return Polymer.dom(this.$.content).getDistributedNodes()[0];
  },

  /**
   * Show the dropdown content.
   */
  open: function () {
    this.$.menuButton.open();
  },

  /**
   * Hide the dropdown content.
   */
  close: function () {
    this.$.menuButton.close();
  },

  _computeItemValue: function (item, keyPath) {
    return (item[keyPath] || item) + '';
  },

  _computeItemLabel: function (item, labelPath) {
    var parts = Polymer.Base._getPathParts(labelPath);
    if (parts.length === 1) {
      return item[labelPath] || item;
    }
    var label = item;
    parts.forEach(function (p) {
      if (label) {
        label = label[p];
      }
    });
    return label;

  },

  _computeKeys: function () {
    var s = ' ';
    for (var i = 48; i <= 126; i++) {
      s += String.fromCharCode(i) + ' ';
    }
    //adding backspace
    s += 'backspace' + ' ';
    return s;
  },

  _computeFilter: function (string) {
    // return a filter function for the current search string
    if (!string) {
      return null;
    }
    string = string.toLowerCase();

    var me = this;
    var labelPath = this.labelPath;
    var parts = Polymer.Base._getPathParts(labelPath);
    if (parts.length === 1) {
      return function (item) {
        return item[labelPath] && item[labelPath].toLowerCase().indexOf(string) > -1;
      };
    }
    return function (item) {
      var label = item;
      parts.forEach(function (p) {
        if (label) {
          label = label[p];
        }
      });
      return label && label.toLowerCase().indexOf(string) > -1;
    };

  },

  /**
   * A handler that is called when the dropdown is tapped.
   *
   * @param {CustomEvent} event A tap event.
   */
  _onTap: function (event) {
    if (Polymer.Gestures.findOriginalTarget(event) === this) {
      this.open();
    }
  },

  _onTagTap: function (e) {
    if (e.detail.isRemoved || (e.srcElement.localName === 'input')) {
      e.stopPropagation();
    }
  },

  _onAscii: function (event) {
    this.open();
    this.async(function () {
      this.set('searchString', this.$.tagInput.value)
    }, 30);

  },

  /**
   * Compute the vertical offset of the menu based on the value of
   * `noLabelFloat`.
   *
   * @param {boolean} noLabelFloat True if the label should not float
   * above the input, otherwise false.
   */
  _computeMenuVerticalOffset: function (noLabelFloat) {
    // NOTE(cdata): These numbers are somewhat magical because they are
    // derived from the metrics of elements internal to `paper-input`'s
    // template. The metrics will change depending on whether or not the
    // input has a floating label.
    return noLabelFloat ? -4 : 8;
  },

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity: function (_value) {
    return this.disabled || !this.required || (this.required && !!this.value);
  },

  _openedChanged: function () {
    var openState = this.opened ? 'true' : 'false';
    var e = this.contentElement;
    if (e) {
      e.setAttribute('aria-expanded', openState);
    }
  }
});
