import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
import './value-array-firebase-behavior.js';
/**
 * `Polymer.PaperTagsBehavior` defines recurent properties in paper-tags family (paper-tags, paper-tags-input, paper-tags-dropdown)
 *
 * @demo demo/index.html
 * @polymerBehavior Polymer.PaperTagsBehavior
 */

Polymer.PaperTagsBehaviorImpl = {

  properties: {

    /**
     * `itemClass` the class applied to tag items.  If `classAccessor` is defined, `classAccessor` will have precedence
     */
    itemClass: String,

    /**
     * `icon` icon to be applied to the tag item when it is not removable. If `iconAccessor` is defined, `iconAccessor` will have precedence
     */
    icon: String,

    /**
     * `keyPath` key for retrieving the `id` from item data object
     */
    keyPath: {
      type: String,
      value: 'id'
    },

    /**
     * `labelPath` key for retrieving the `label` from item data object
     */
    labelPath: {
      type: String,
      value: 'label'
    },

    /**
     * `classAccessor` key for retrieving the `class` from item data object
     */
    classAccessor: String,

    /**
     * `iconAccessor` key for retrieving the `icon` from item data object
     */
    iconAccessor: String,

    /**
     * `preventRemoveTag` hide the `close` icon and prevent removing a tag when true. 
     */
    preventRemoveTag: {
      type: Boolean,
      value: false
    }
  }
};

Polymer.PaperTagsBehavior = [
  Polymer.PaperTagsBehaviorImpl,
  Polymer.ValueArrayFirebaseBehavior
];
