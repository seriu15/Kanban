$(function() {

	function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    var i = 0;
    for (i = 0; i < 10; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
	}

	function Board(title){
		var self = this;
		this.id = randomString;
		this.title = title;
		this.$element = createBoard();
		this.columns = [];

		function createBoard() {
			// TWORZENIE ELEMENTÓW SKŁADOWYCH KOLUMNY
			var $board = $('<div>').addClass('board');
			var $boardTitle = $('<h2>').addClass('board-title').text(self.title);
			var $boardDelete = $('<button>').addClass('btn-delete').html('<i class="fa fa-times-circle" aria-hidden="true"></i>');
			var $boardAddColumn = $('<button>').attr('type','button').addClass('create-column').attr('data-toggle', 'modal').attr('data-target','#myModal').attr('data-whatever','kolumny').text('Dodaj kolumnę');
			var $boardAddColumnContainer = $('<div>').addClass('column-container');

			// PODPINANIE ODPOWIEDNICH ZDARZEŃ
			$boardDelete.click(function() {
				self.removeBoard();
			});

			// KONSTRUOWANIE ELEMENTU TABLICY
			$board.append($boardTitle)
							.append($boardDelete)
							.append($boardAddColumn)
							.append($boardAddColumnContainer);

			// ZWRACANIE STWORZONEJ  TABLICY
			return $board;
		}
	}

	Board.prototype = {
    addColumn: function(column) {
			var newColumn = column.$element;
			newColumn.data('column-number', this.columns.length);
			this.$element.children('.column-container').append(newColumn);  //data-column-number
			this.columns.push(column);
			this.cards = [];

		},
    removeBoard: function() {
      this.$element.remove();
    }
	};

	function Column(name) {
		var self = this;
		this.id = randomString();
    this.name = name;
    this.$element = createColumn();

		function createColumn() {
			// TWORZENIE ELEMENTÓW SKŁADOWYCH KOLUMNY
			var $column = $('<div>').addClass('column');
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
      this.$element.remove();
    }
	};

	function Card(description) {
		var self = this;
		this.id = randomString();
		this.description = description;
		this.$element = createCard();

		function createCard() {
			// TWORZENIE KLOCKÓW
			var $card = $('<li>').addClass('card');
			var $cardDescription = $('<p>').addClass('card-description').text(self.description);
			var $cardDelete = $('<button>').addClass('btn-delete').html('<i class="fa fa-times-circle" aria-hidden="true"></i>');

			// PRZYPIĘCIE ZDARZENIA
			$cardDelete.click(function(){
			  self.removeCard();
			});

			// SKŁADANIE I ZWRACANIE KARTY
			$card.append($cardDelete).append($cardDescription);
				return $card;
		}
	}

	Card.prototype = {
		removeCard: function() {
			this.$element.remove();
		}
	}

	var boardsObject = {
    name: 'Tablica Kanban',
    addBoard: function(board) {
      this.$element.append(board.$element.data('board-number', this.boards.length));
			this.boards.push(board);
		},
    $element: $('#boards'),
		boards: []
	};

	//Funkcja inicjalizujaca sortowanie kart
	function initSortable() {
		$('.board').each(function(){
			var thisBoardAndColumnCardList = $(this).find('.column-card-list');
			thisBoardAndColumnCardList.sortable({
				connectWith: thisBoardAndColumnCardList,
				placeholder: 'card-placeholder'
			}).disableSelection();
		});
	}

	// Podmiana parametrow modala
	$('#myModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);  // przycisk ktory wywolal modala
		var recipient = button.data('whatever');
		var modal = $(this);
		modal.find('.modal-title').text('Nazwa ' + recipient)

		if(button.data('whatever') == 'tablice') {
   		$('.btn-confirm').off('click').on('click', function(){
				var modalInput = $('#message-text').val();
        boardsObject.addBoard(new Board(modalInput));
				$('#message-text').val("");
				$('#myModal').modal('hide');
   		});
		} else if(button.data('whatever') == 'kolumny') {
      $('.btn-confirm').off('click').on('click', function(){
				var modalInput = $('#message-text').val();
				boardsObject.boards[button.closest('.board').data('board-number')].addColumn(new Column(modalInput));
				$('#message-text').val("");
				$('#myModal').modal('hide');
				initSortable();
			});
    } else if(button.data('whatever') == 'karty') {
      $('.btn-confirm').off('click').on('click', function(){
				var modalInput = $('#message-text').val();
				boardsObject.boards[button.closest('.board').data('board-number')].columns[button.closest('.column').data('column-number')].addCard(new Card(modalInput));
				$('#message-text').val("");
				$('#myModal').modal('hide');
			});
    }
		$('.btn-cancel').off('click').on('click', function(){
			$('#message-text').val("");
		});
	});

	// TWORZENIE TABLICY
	var myFirstBoard = new Board('Tablica');

	// TWORZENIE KOLUMN
	var todoColumn = new Column('Do zrobienia');
	var doingColumn = new Column('W trakcie');
	var doneColumn = new Column('Skończone');

	// DODAWANIE TABLICY DO KONTENERA
	boardsObject.addBoard(myFirstBoard);

	// DODAWANIE KOLUMN DO TABLICY
	myFirstBoard.addColumn(todoColumn);
	myFirstBoard.addColumn(doingColumn);
	myFirstBoard.addColumn(doneColumn);

	// TWORZENIE NOWYCH EGZEMPLARZY KART
	var card1 = new Card('Nowe zadanie');
	var card2 = new Card('Stworzyć tablice kanban');

	// DODAWANIE KART DO KOLUMN
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);

})
