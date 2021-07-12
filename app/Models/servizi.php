<?php

use Illuminate\Database\Eloquent\Model;

class servizi extends Model{
    protected $table = 'servizi';
    protected $primaryKey = 'id';
    protected $autoIncrement = true;
    protected $keyType = 'int';
    public $timestamps = false;

    public function salone(){
        return $this->belongsTo('salone', 'iva', 'idSalone');
    }
}