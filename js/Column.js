function Column(id, name) {
  var self = this;
  this.id = id;
  this.name = name || 'Nie podano nazwy';
  this.$element = createColumn();

  function createColumn() {
    // TWORZENIE ELEMENTÓW SKŁADOWYCH KOLUMNY
    var columnNumber = $('div.column').length;
    var $column = $('<div>').attr('id', id).data('column-number', columnNumber).addClass('column');
    var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
    var $columnCardList = $('<ul>').addClass('column-card-list');
    var $columnDelete = $('<button>').addClass('btn-delete').html('<i class="fa fa-times-circle" aria-hidden="true"></i>');
    var $columnAddCard = $('<button>').attr('type','button').addClass('add-card').attr('data-toggle', 'modal').attr('data-target','#myModal').attr('data-whatever','karty').text('Dodaj kartę');

    // PODPINANIE ODPOWIEDNICH ZDARZEŃ
    $columnDelete.click(function() {
      self.removeColumn();
    });

    // KONSTRUOWANIE ELEMENTU KOLUMNY
    $column.append($columnTitle)
            .append($columnDelete)
            .append($columnAddCard)
            .append($columnCardList);

    // ZWRACANIE STWORZONEJ  KOLUMNY
    return $column;
  }
}

Column.prototype = {
  addCard: function(card) {
    this.$element.children('ul').append(card.$element);
    initSortable();
  },
  removeColumn: function() {
    var self = this;
    $.ajax({
      url: baseUrl + '/column/' + self.id,
      method: 'DELETE',
      success: function(response){
        self.$element.remove();
      }
    });
  }
};
