(function($) {

  // Given a parent, and a configuration structure,
  // produces an invisible grid into which you
  // may place any element.
  $.Layout = function(options) {

    jQuery.extend(true, this, {
      slots:            {},
      layout:           null,
      parent:           null,
      layoutContainer:  null,
      elements:         null
    }, options);

    this.init();

  };

  $.Layout.prototype = {
    init: function() {
      var _this = this;

      this.graph = this.calculateSlotGraph();
      console.log(this.graph);
      jQuery.each(_this.graph, function(index, slot) {
        // get this all dynamic-like.
        var layoutDimensions = slot.layoutDimensions;
        layoutDimensions.id = slot.id;
        
        _this.slots[slot.id] = new $.LayoutBox(layoutDimensions);

      });

      this.bindEvents();
    },

    calculateSlotGraph: function() {
      var _this = this,
      slots = {},
      containerWidth = _this.layoutContainer.outerWidth(),
      containerHeight = _this.layoutContainer.outerHeight();
      // given:
      // a slot's "position in the layout" and the container width,
      // 
      // It is required to find a slot's layoutDimensions.
      // the position in the layout means "what are the parents?"
      // "is it a row or a column?"
      //
      // With the simple case of the single column workspace:
      // the width is "width", there is only one child, and it is 
      // a leaf node. It will have 100% width and 100% height. 
      //
      // With the slightly more complicated case of the 2-column
      // compare workspace:
      // width is "width" (of the container), and the workspace
      // will now be bifurcated. Any remaining space will now
      // be partitioned out of half of the remaining space.
      // Thankfully, the next level are leaves, so there is 
      // no need to store or sort remaining space.
      //
      // With the "reference" workspace, or when there is a 
      // free-form tiled view, the subtraction of remaining
      // space must continue at each iteration.

      // extracts only the leaves of the tree.
      function crawlLayout(tree, slots) {
        tree.forEach(function(branch, index) {
          if ( !branch.hasOwnProperty('children') && branch.slot === true ) {
            var siblings = tree.filter(function(br) {
              return br.id !== branch.id ? true : false;
            });
            branch.siblingIDs = siblings.map(function(sibling){ return sibling.id; });

            // var x = branch.sibling
            //

            branch.layoutDimensions = {
              x: containerWidth/tree.length*index,
              y: 0,
              width: containerWidth/tree.length,
              height: containerHeight,
              handles: "all",
              container: _this.layoutContainer
            };

            slots[branch.id] = branch;
            // siblings
            // layout dimensions
            // parent (a slot is always a leaf, and thus has no children).
            //
          }
          else {
            crawlLayout(branch.children, slots);
          }
        });
      }

      crawlLayout(_this.layout, slots);

      return slots;
    },

    // for a given area, get the required dimensions
    //
    // (width, height, x/y positions for a layout
    // slot's DOM element)
    getDimensionsFromLayoutGraph: function() {

    },

    bindEvents: function() {
      var _this = this;

      // A layout element is resized. Detect whether
      // it is a row or a column and resize its siblings
      // accordingly, recalculating the layout.
      
      // throttle the resize event and broadcast the
      // new widths and heights to all necessary children,
      // having them resize themselves.

      // The workspace container is resized, 

      // A new slot is added.
      
      // A new slot is removed.
      
      // A slot is moved from one place to another by dragging.

    },

    addSlot: function() {
      // insert at position in DOM with 0 width/height
      // depending on if it is a column or a row and
      // animate resizing it to its correct position.
    },

    resizeSlot: function(slotID) {
      // For given slot, select the siblings that 
      // need resizing, do some math for them, 
      // resize them along with a given element.
      //
      // Siblings must be resized. If the parent is a 
      // top-most column or row, then it will not be
      // resizeable in one direction. Therefore, the only
      // remaining dimension will steal or give space to 
      // the siblings that they must fill according to 
      // their previous occupation of the gnomon.  
      //
      // If the parent is a lower-level column or row, 
      // and the event target slot is resized in a way
      // that does not give room to its siblings, then
      // the virtual parent will expand, stealing room 
      // from its siblings. The result will be more room
      // that all its children will fill together.
      //
      // The resize events can be delegated up or down, 
      // affecting only one layer of hierarchy.
    }
    
  };

}(Mirador));

