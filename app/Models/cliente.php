<?php

use Illuminate\Database\Eloquent\Model;

class cliente extends Model{
    protected $table = 'cliente';
    protected $primaryKey = 'CF';
    protected $autoIncrement = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public function saloniPreferiti(){
        return $this->hasMany('saloniPreferiti', 'idCliente', 'CF');
    }

    public function appuntamenti(){
        return $this->hasMany('appuntamento', 'cliente', 'CF')->where('appuntamento.dataInizio', '>', date("Y-m-d H:i:s"));
    }
}