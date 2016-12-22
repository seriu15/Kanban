function Card(id, name) {
  var self = this;
  this.id = id;
  this.name = name || 'Nie podano nazwy';
  this.$element = createCard();

  function createCard() {
    // TWORZENIE KLOCKÓW
    var $card = $('<li>').attr('id', id).addClass('card');
    var $cardDescription = $('<p>').addClass('card-description').text(self.name);
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
    var self = this;
    $.ajax({
      url: baseUrl + '/card/' + self.id,
      method: 'DELETE',
      success: function(){
        self.$element.remove();
      }
    });
  }
}
