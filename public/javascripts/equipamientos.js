jQuery(document).ready(function($) {
  $('.equip_item').click(function(e) {
    window.location = '/equipamientos/'+ this.id;
  });
  $('#edit').click(function(e) {
      console.log(EquipamientoForm);
      $.ajax({
                  url: "/equipamientos/" + $('#equipamiento_id').val(),
                  type: "PUT",
                  data: EquipamientoForm.getValidData(),
                  error: function(XMLHttpRequest, textStatus, errorThrown){
                      alert(errorThrown);
                  }, success: function(data, textStatus, XMLHttpRequest){
                    location.href="/equipamientos";
                  }
              });
      });
});
