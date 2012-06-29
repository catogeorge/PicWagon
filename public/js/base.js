var PicWagon = PicWagon | {};

PicWagon.ovarlay = function(el){
    this.el = el;
};

$(document).ready(function(){
    $('div.picker').ImagePicker({
        searchTerm: 'car',
        onItemSelect: function(item){
            $('#thumb').attr('src', item.url);
        }
	});
});
