<?php

use Illuminate\Database\Eloquent\Model;

class saloniPreferiti extends Model{
    protected $table = 'saloni_preferiti';
    protected $primaryKey = 'id';
    protected $autoIncrement = true;
    protected $keyType = 'int';
    public $timestamps = false;

    public function salone(){
        return $this->belongsTo('salone', 'idSalone', 'Iva');
    }

    public function user(){
        return $this->belongsTo('cliente', 'idCliente', 'CF');
    }
}