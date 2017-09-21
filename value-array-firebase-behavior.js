import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
/**
 * `Polymer.ValueArrayFirebaseBehavior` ensures the binding between array values and firebase objects.
 *
 * @demo demo/index.html
 * @polymerBehavior Polymer.ValueArrayFirebaseBehavior
 */

Polymer.ValueArrayFirebaseBehavior = {

  properties: {
    /**
     * `valueObject` store value as object keys `{"value1": true, "value2": true}`
     */
    valueObject: {
      type: Object,
      notify: true
    },

    /**
     * `valueArray` store value as array `["value1", "value2"]`
     */
    valueArray: {
      type: Array,
      notify: true
    },

    /**
     * `valueJoin` joins values in a string
     */
    valueJoin: {
      type: String,
      notify: true,
      readOnly: true,
    }
  },
  observers: [
    '_observeValueObject(valueObject.*)',
    '_observeValueArrayInit(valueArray)',
    '_observeValueArray(valueArray.splices)',
  ],

  //called when we set/reset valueArray 
  _observeValueArrayInit: function (valueArray) {
    this._isInitiatingValueArray = true;
    if (valueArray && !this._isUpdatingValueObject) {
      var o = {};
      this.valueArray.forEach(function (item) {
        o[item] = true;
      });
      this.set('valueObject', o);
      this._setValueJoin(this.valueArray.join(', '));
    }
    delete this._isInitiatingValueArray;
  },

  /**
   * `_observeValueArray` ensures valueArray and valueObject are in sync
   */
  _observeValueArray: function (splices) {
    if (!splices) {
      return;
    }
    this._isUpdatingValueArray = true;
    // console.log('ARRAY SPLICE', splices);
    if (!this._isUpdatingValueObject) {
      splices.indexSplices.forEach(function (splice) {
        splice.removed.forEach(function (removed) {
          this.set('valueObject.' + removed, null); // so that it is deleted at firebase level
          this.fire('tag-removed', removed);
        }, this);
        if (splice.addedCount) {
          for (var i = 0; i < splice.addedCount; i++) {
            var index = splice.index + i;
            var newValue = splice.object[index];
            this.set('valueObject.' + newValue, true);
            this.fire('tag-added', newValue);
          }
        }
      }, this);

      this._setValueJoin((this.valueArray || []).join(', '));
    }
    delete this._isUpdatingValueArray;
  },

  /**
   * `_observeValueObject` ensures valueArray and valueObject are in sync
   */
  _observeValueObject: function (obj) {
    this._isUpdatingValueObject = true;
    if (!this._isUpdatingValueArray && !this._isInitiatingValueArray) {
      var keys = Object.keys(this.valueObject).filter(function (item) {
        return !!item;
      });
      this.syncValueArrayWithKeys(keys);

      this._setValueJoin(this.valueArray.join(', '));
    }
    delete this._isUpdatingValueObject;
  },

  syncValueArrayWithKeys: function (keys) {
    if (!this.valueArray) {
      this.valueArray = [];
    }
    // removed values not present in keys
    var tmpArray = [].concat(this.valueArray);
    tmpArray.forEach(function (v) {
      if (keys.indexOf(v) < 0) {
        this.splice('valueArray', this.valueArray.indexOf(v), 1);
      }
    }, this);
    // add all missing keys
    keys.forEach(function (k) {
      if (this.valueArray.indexOf(k) < 0) {
        this.push('valueArray', k);
      }
    }, this);
  }

};
