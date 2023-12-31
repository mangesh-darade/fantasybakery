<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="modal-dialog modal-lg">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                <i class="fa fa-2x">&times;</i>
            </button>
            <button type="button" class="btn btn-xs btn-default no-print pull-right" style="margin-right:15px;" onclick="window.print();">
                <i class="fa fa-print"></i> <?= lang('print'); ?>
            </button>
            <h4 class="modal-title" id="myModalLabel"><?= lang('view_payments').' ('.lang('sale').' '.lang('reference').': '.$inv->reference_no.')'; ?></h4>
        </div>
        <div class="modal-body">
            <div class="table-responsive">
                <table id="CompTable" cellpadding="0" cellspacing="0" border="0"
                       class="table table-bordered table-hover table-striped">
                    <thead>
                    <tr>
                        <th style="width:30%;"><?= $this->lang->line("date"); ?></th>
                        <th style="width:30%;"><?= $this->lang->line("reference_no"); ?></th>
                        <th style="width:15%;"><?= $this->lang->line("amount"); ?></th>
                        <th style="width:15%;"><?= $this->lang->line("paid_by"); ?></th>
                        
                        <?php 
                            
                       if ($payments[0]->paid_by == 'gift_card' || $payments[0]->paid_by == 'CC' || $payments[0]->paid_by == 'DC'){
                           $tansactlable =  lang('transaction_no');
                           $tansactvalue =  $payments[0]->transaction_id;
                       }
                       elseif ($payment->paid_by == 'Cheque') {
                           $tansactlable =  lang('cheque_no');
                           $tansactvalue =  $payments[0]->cheque_no ;
                       } else {
                           $tansactvalue = $tansactlable = '';
                       }

                       //if($tansactlable) {
                           echo '<th style="width:15%;">'.lang('transaction_no').'</th>';
                       //}
                        ?>
                        
                        <th style="width:10%;"><?= $this->lang->line("actions"); ?></th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php if (!empty($payments)) {
                        foreach ($payments as $payment) { ?>
                            <tr class="row<?= $payment->id ?>">
                                <td><?= $this->sma->hrld($payment->date); ?></td>
                                <td><?= $payment->reference_no; ?></td>
                                <td><?= $this->sma->formatMoney($payment->amount) . ' ' . (($payment->attachment) ? '<a href="' . site_url('welcome/download/' . $payment->attachment) . '"><i class="fa fa-chain"></i></a>' : ''); ?></td>
                                <td><?= lang($payment->paid_by); ?></td>                                
                                <?php
                                  if($payment->transaction_id) {
                                     echo '<td>'.$payment->transaction_id.'</td>';
                                 }else if($payment->cheque_no){
                                     echo '<td>'.$payment->cheque_no.'</td>';

                                 }else if($payment->cc_no){
                                     echo '<td>'.$payment->cc_no.'</td>';
                                 }else{
                                    echo '<td></td>';
                                 }
                                ?>                                
                                <td>
                                    <div class="text-center">
                                        <a href="<?= site_url('sales/payment_note/' . $payment->id) ?>"
                                           data-toggle="modal" data-target="#myModal2"><i class="fa fa-file-text-o"></i></a>
                                        <?php if ($payment->paid_by != 'gift_card') { ?>
                                            <a href="<?= site_url('sales/edit_payment/' . $payment->id) ?>"
                                               data-toggle="modal" data-target="#myModal2"><i class="fa fa-edit"></i></a>
                                            <a href="#" class="po del_btn_group" title="<b><?= $this->lang->line("delete_payment") ?></b>"
                                               data-content="<p><?= lang('r_u_sure') ?></p><a class='btn btn-danger' id='<?= $payment->id ?>' href='<?= site_url('sales/delete_payment/' . $payment->id) ?>'><?= lang('i_m_sure') ?></a> <button class='btn po-close'><?= lang('no') ?></button>"
                                               rel="popover"><i class="fa fa-trash-o"></i></a>
                                        <?php } ?>
                                    </div>
                                </td>
                            </tr>
                        <?php }
                    } else {
                        echo "<tr><td colspan='5'>" . lang('no_data_available') . "</td></tr>";
                    } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" charset="UTF-8">
    $(document).ready(function () {
$('#recent_pos_sale_modal-loading').hide();
        $(document).on('click', '.po-delete', function () {
            var id = $(this).attr('id');
            $(this).closest('tr').remove();
        });
    });
</script>
