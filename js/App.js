var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': 112,
  'X-Auth-Token': '74a18792f54358e40d88fa3ea5db4516'
};

$.ajaxSetup({
	headers: myHeaders
});

$.ajax({
  url: baseUrl + '/board',
  method: 'GET',
  success: function(response) {
    setupColumns(response.columns);
  }
});

function setupColumns(columns) {
  columns.forEach(function (column) {
    var col = new Column(column.id, column.name);
    board.createColumn(col);
    setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
  cards.forEach(function (card) {
    var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    col.addCard(card);
  })
}

// Podmiana parametrow modala
$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);  // przycisk ktory wywolal modala
  var recipient = button.data('whatever');
  var modal = $(this);
  modal.find('.modal-title').text('Nazwa ' + recipient)

  if(button.data('whatever') == 'kolumny') {
    $('.btn-confirm').off('click').on('click', function(){
      var modalInput = $('#message-text').val();

      $.ajax({
    		url: baseUrl + '/column',
    		method: 'POST',
    		data: {
          name: modalInput
  		  },
    		success: function(response){
          board.createColumn(new Column(response.id, modalInput));
          $('#message-text').val("");
          $('#myModal').modal('hide');
          initSortable();
        }
      });
    });
  } else if(button.data('whatever') == 'karty') {
    $('.btn-confirm').off('click').on('click', function(){
      var modalInput = $('#message-text').val();

      $.ajax({
        url: baseUrl + '/card',
        method: 'POST',
        data: {
          name: modalInput,
          bootcamp_kanban_column_id: button.closest('.column').attr('id')  // jak odwolac sie do id
        },
        success: function(response) {
            board.columns[button.closest('.column').data('column-number')].addCard(new Card(response.id, modalInput));
            $('#message-text').val("");
            $('#myModal').modal('hide');
        }
      });
    });
  }
  $('.btn-cancel').off('click').on('click', function(){
    $('#message-text').val("");
  });
});
