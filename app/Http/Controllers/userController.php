<?php

use Illuminate\Routing\Controller as BaseController;

class userController extends BaseController
{
    function home(){
        $logged = false;
        //Check Session
        if(null!==session('_barberapp_mail')){
            $logged = true;
            if(session('_barberapp_typeUser') == 'Cliente'){
                $userInfo = cliente::where("mail", session('_barberapp_mail'))
                                    ->get();
            } else{
                $logged = false;
            }
        } else{
            $logged = false;
        }

        if($logged == true){
            return view('user')
            ->with("userInfo", $userInfo)
            ->with("sessionTypeUser", session('_barberapp_typeUser'))
            ->with("logged", $logged);
        } else{
            return redirect('../');
        }
    }

    function loadSaloniPreferiti(){
        return cliente::find(session('_barberapp_cf'))->saloniPreferiti()->join('salone', 'salone.Iva', '=', 'saloni_preferiti.idSalone')
        ->get();
    }

    function loadServiziSalone(){
        return salone::find(request('iva'))->serviziSalone;
    }

    function insertAppuntamento(){
        $idUtente = session('_barberapp_cf');
        $dateTime = request('date');
        $servizio = request('servizio');
        $salone = request('salone');

        if(isset($idUtente) == true && isset($dateTime) == true && isset($servizio) == true && isset($salone) == true){

            $appuntamento = new appuntamento;
            $appuntamento->dataInizio = $dateTime;
            $appuntamento->cliente = $idUtente;
            $appuntamento->salone = $salone;
            $appuntamento->servizio = $servizio;
            if($dateTime > date("Y-m-d H:i:s"))
            $query = $appuntamento->save();
            else
            $query = 0;
            
            if($query){
                echo json_encode(array("Appuntamento inserito correttamente."));
            } else{
                echo json_encode(array('Connessione al database fallita'));
            }
        } else{
            echo json_encode(array("Inserisci tutti i campi del form"));
        }
    }

    function loadAppuntamentiCliente(){
        $cfCliente = session('_barberapp_cf');
        $query = cliente::find($cfCliente)
            ->appuntamenti()
            ->join('salone', 'salone.Iva', '=', 'appuntamento.salone')
            ->join('servizi', 'servizi.id', '=', 'appuntamento.servizio')
            ->select('appuntamento.*', 'salone.nome as nomeSalone', 'servizi.nome as nomeServizio', 'salone.*', 'servizi.*')
            ->get();

        if(count($query) > 0){

            return $query;

        } else{
            return json_encode(array('Connessione al db non riuscita.'));
        }
    }

    function disdiciAppuntamento(){
        $cfCliente = session('_barberapp_cf');
        $data = request('data');
        $salone = request('salone');
        if($data > date("Y-m-d H:i:s")){
            $query = appuntamento::where('cliente', $cfCliente)
                ->where('salone', $salone)
                ->where('dataInizio', $data)
                ->delete();
        } else{
            $query = 0;
        }

        if($query){

            return json_encode(array('Appuntamento disdetto'));

        } else{
            return json_encode(array('Connessione al db non riuscita.'));
        }
    }

    function loadSaloni(){
        $query = salone::all();;

        if(count($query) > 0){
            return $query;
        } else{
            return json_encode(array('Connessione al db non riuscita.'));
        }
    }

    function removeSalonePreferito(){
        $idUtente = request('cf');
        $idSalone = request('idSalone');
        
        $query = saloniPreferiti::where('idSalone', $idSalone)
            ->where('idCliente', $idUtente)
            ->delete();

        if($query){
            return json_encode(array('Deleted'));
        } else{
            return json_encode(array('Connessione al db non riusicta.'));
        }
    }

    function addSaloniPreferiti(){
        $idSalone = request('idSalone');
        $idCliente = request('cf');
        $salonePreferito = new saloniPreferiti;
        $salonePreferito->idCliente = $idCliente;
        $salonePreferito->idSalone = $idSalone;
        $query = $salonePreferito->save();

        if($query){
            return json_encode(array('Insert ok'));
        } else{
            return json_encode(array('Connessione al db non riusicta.'));
        }
    }
}