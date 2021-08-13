import Component from '@ember/component';

export default Component.extend({
    currentDragEnteredItem: null,
    setDragEnteredItem(item) {
        this.set('currentDragEnteredItem', item);
    },
    onElementDropped() {
        this.set('currentDragEnteredItem.isObstructor', true);
        this.set('currentDragEnteredItem.isDraggable', true);
    }
});
