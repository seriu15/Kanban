var board = {
	name: 'Tablica Kanban',
	createColumn: function(column) {
	  this.element.append(column.$element);
		this.columns.push(column);
	  initSortable();
	},
	element: $('#board .column-container'),
	columns: []
};

//Funkcja inicjalizujaca sortowanie kart
function initSortable() {
  $('.board').each(function(){
    var thisBoardAndColumnCardList = $(this).find('.column-card-list');
    thisBoardAndColumnCardList.sortable({
      connectWith: thisBoardAndColumnCardList,
      placeholder: 'card-placeholder',
			receive: function( event, ui ) {
				$.ajax({
	        url: baseUrl + '/card/' + $(ui.item).attr('id'),
	        method: 'PUT',
	        data: {
	          name: $(ui.item).text(),
	          bootcamp_kanban_column_id: $(ui.item).closest(".column").attr('id')
					}
	      });
			}
    }).disableSelection();
  });
}
