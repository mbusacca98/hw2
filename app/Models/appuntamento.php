<?php

use Illuminate\Database\Eloquent\Model;

class appuntamento extends Model{
    protected $table = 'appuntamento';
    protected $primaryKey = 'id';
    protected $autoIncrement = true;
    protected $keyType = 'int';
    public $timestamps = false;

    public function salone(){
        return $this->hasOne('salone', 'Iva', 'salone');
    }

    public function cliente(){
        return $this->hasOne('cliente', 'cf', 'cliente');
    }

    public function servizio(){
        return $this->hasOne('servizio', 'id', 'servizio');
    }
}