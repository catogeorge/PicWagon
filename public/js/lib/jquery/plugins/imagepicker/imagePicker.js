(function( $ ){
    var picker = function(opts){
		var defaults = {
			onShow: function (){},
			onBeforeShow: function(){},
			onHide: function (){},
			onBeforeHide: function(){},
			onItemSelect: function(){},
			onItemOut: function(){},
			onItemOver: function(){},
			imageSize: 75,
			imageRows: 4,
			imageColumns: 4,
			imageMargin: 3,
            searchTerm: 'avatar'
		}; 
        var o =  $.extend( {}, defaults, opts );
        this.options = o;
        this.overlay = null;
        this.currentPage = 0;
        this.visiblePage = 0;
        this.pageWidth = ((o.imageSize*o.imageRows)+(o.imageRows*8));
        this.pageHeight = ((o.imageSize*o.imageColumns)+(o.imageColumns*8));
        this.imageCount = o.imageRows*o.imageColumns;;
        this.imagesEl = null;
        this.search = 'http://www.textecho.com/fetchr-html.php?method=flickr.photos.search&per_page={imagecount}&tags={tag}&page={pagenumber}&tag_mode=any&extras=owner_name&TEformat=js&callbackData={pageid}';
        this.visible = false;
        this.initialized = false;
        this.id = 'imagepicker_' + parseInt(Math.random() * 10000000, 10);
    };
    
    picker.prototype = {
        init : function(root) {
            var self = this;;
            // Using template create a new element and give it this id
			var template = $(this.tpl).attr('id', this.id);
			$(template).find('.imagepicker_images').height(this.pageHeight);
			$(template).find('.imagepicker_images').width(this.pageWidth);
			$(template).width(this.pageWidth+100);
            this.overlay = template;
            $(this.overlay).data('imagepicker', this);
            // Assign images el for later
            this.imagesEl = template.find('.imagepicker_images');
			// Add the new element to the document
			template.insertAfter($(root));
			// Bind the click event to the element
			$(root).click(function(){
				if(self.visible){
					self.hide(300);
				} else {
					self.show(300);
				}
			});
            $(this.imagesEl).on('click', 'li.flickrphoto', function(){
                self.itemSelect(this);
            });
        },
		itemSelect : function(item){
			var ii = $(item).data('imageinfo');
			this.currentImage = ii;
			this.options.onItemSelect(eval('('+ii+')'));
            this.hide();
			return false;
		},
		show : function (s) {
			var self = this;
			var contentEl = this.overlay;
			var opts = this.options;
			opts.onBeforeShow();
			contentEl.slideDown(s);
			if(!(this.initialized)){
				contentEl.find('.imagepicker_next').click(function() {
                    self.showNext();
				});
				contentEl.find('.imagepicker_prev').click(function() {
                    self.showPrev();
				});
				this.preload(5);
			}
			this.visible = true;
			this.initialized = true;
			opts.onShow();
		},
		hide : function (s) {
			this.overlay.slideUp(s);
			this.visible = false;
			this.options.onHide();
		},
		showPrev : function(){
            var self = this;
			var ph = this.pageHeight;
			//var cp = $(picker).data('currentPage');
			var vp = this.visiblePage;
			var nvp = vp-1;
			if(nvp >= 0){
				this.imagesEl.find('div:first').animate({marginTop:(nvp*ph*(-1))}, 200, function(){
					self.visiblePage = nvp;
				});
			}
		},
		showNext : function(){
            var self = this;
			var ph = this.pageHeight;
			var vp = this.visiblePage;
			var nvp = vp+1;
			//var pages = ($(imagesEl).find('.page').length);
			this.imagesEl.find('div:first').animate({marginTop:(nvp*ph*(-1))}, 200, function(){
				self.visiblePage = nvp;
			});
			this.preload();
		},
        preload : function(n){
            var count = n || 1;
            var ph = this.pageHeight;
			var pw = this.pageWidth;
			//var is = this.options.imageSize;
			var cp = this.currentPage;
			//var vp = $(picker).data('visiblePage');
			var pageID = 'TE'+parseInt(Math.random()*100000000, 10);
			var nextPage = $('<div id="'+pageID+'" class="loading" />');
			var ncp = cp+1;
			nextPage.height(ph);
			nextPage.width(pw);
			this.imagesEl.append(nextPage);
			this.currentPage = ncp;
			var dataScript = this.search.replace(/{pagenumber}/g, ncp).replace(/{imagecount}/g, this.imageCount).replace(/{pageid}/g, (this.id + ':' + pageID)).replace(/{tag}/, this.options.searchTerm);
			jQuery.ajax({
				url: dataScript,
				dataType: 'jsonp',
				jsonp:'callbackMethod',
				jsonpCallback:'$().ImagePickerFillPage'
			});
            count--;
            if (count > 0) {
                this.preload(count);
            }
		},
        fillPage : function(p, html){
            var page = $('#'+p);
            page.html(html);
            $(page).find('img').width(this.options.imageSize);
            page.removeClass('loading');
        },
        tpl : '<div class="imagepicker"><div class="imagepicker_selector imagepicker_next"><div>NEXT</div></div><div class="imagepicker_selector imagepicker_prev"><div>PREVIOUS</div></div><div class="imagepicker_images"></div></div>'
 
    };
    
    var methods = {
        init : function( options ) {
            $(this).each(function(){
                if (!($(this).data('imagepicker'))) {
                    var ip = new picker(options);
                    ip.init(this);
                    $(this).data('imagepicker', ip);
                }
                console.info($(this).data('imagepicker'));
            });
            return(this);
        },
        hidePicker : function( ) {
            // ...
        },
        showPicker : function( ) { 
            // ... 
        },
        getImage : function( ) { 
            // ... 
        },
        getPicker : function( ) {
            // ... 
        },
        fillPage : function(  ) { 
            // ...
        }
    };

    $.fn.ImagePicker = function( method ) {
    
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    };
    $.fn.ImagePickerFillPage = function(data, elid){
        var ids = elid.split(':');
        $('#'+ids[0]).data('imagepicker').fillPage(ids[1], data);
    };

})( jQuery );
