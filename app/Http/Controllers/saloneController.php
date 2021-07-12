<?php

use Illuminate\Routing\Controller as BaseController;

class saloneController extends BaseController
{
    function home(){
        $logged = false;
        //Check Session
        if(null!==session('_barberapp_mail')){
            $logged = true;
            if(session('_barberapp_typeUser') == 'Salone'){
                $userInfo = salone::where("mail", session('_barberapp_mail'))
                                    ->get();
            } else{
                $logged = false;
            }
        } else{
            $logged = false;
        }

        if($logged == true){
            return view('salone')
            ->with("userInfo", $userInfo)
            ->with("sessionTypeUser", session('_barberapp_typeUser'))
            ->with("logged", $logged);
        } else{
            return redirect('../');
        }
    }

    function appuntamenti(){
        $ivaSalone = session('_barberapp_iva');
        $query = salone::find($ivaSalone)
            ->appSalone()
            ->join('cliente', 'cliente.CF', '=', 'appuntamento.cliente')
            ->join('servizi', 'servizi.id', '=', 'appuntamento.servizio')
            ->select('appuntamento.*', 'cliente.Nome as nomeCliente', 'cliente.*', 'servizi.Nome as nomeServizio', 'servizi.*')
            ->where('appuntamento.dataInizio', '>', date("Y-m-d H:i:s"))
            ->get();

        if(count($query) > 0){

            return $query;

        } else{
            return json_encode(array('Connessione al db non riuscita.'));
        }
    }

    function disdiciAppuntamento(){
        $ivaSalone = session('_barberapp_iva');
        $data = request('data');
        $cfCliente = request('cliente');
        if($data > date("Y-m-d H:i:s")){
          $query = appuntamento::where('cliente', $cfCliente)
          ->where('salone', $salone)
          ->where('dataInizio', $data)
          ->delete();  
        }

        if($query){

            return json_encode(array('Appuntamento disdetto'));

        } else{
            return json_encode(array('Connessione al db non riuscita.'));
        }
    }

    function loadServizi(){
        return salone::find(session('_barberapp_iva'))->serviziSalone;
    }

    function deleteServizio(){
        if(null!==(session('_barberapp_iva')) && null!==(request('id'))){
            $idServizio = request('id');
            
            $query = servizi::find($idServizio)
                ->delete();
    
            if($query){
                return json_encode(array('ok'));
    
            } else{
                return json_encode(array('Connessione al db non riuscita.'));
            }
        }
    }

    function addServizio(){
        $ivaSalone = session('_barberapp_iva');
        $nomeServizio = request('nomeServizio');
        $categoria = request('categoria');
        $durata = request('durata');
        $prezzo = request('prezzo');

        if(null!==($ivaSalone) && null!==($nomeServizio) && null!==($categoria) && null!==($durata) 
            && null!==($prezzo)){

            $servizio = new servizi;
            $servizio->idSalone = $ivaSalone;
            $servizio->id_categoria = $categoria;
            $servizio->prezzo = $prezzo;
            $servizio->nome = $nomeServizio;
            $servizio->durata = $durata;
            $query = $servizio->save();
            
            if($query){
                return json_encode(array($ivaSalone, $nomeServizio, $categoria, $durata, $prezzo, $servizio->id));
            } else{
                return json_encode(array('Errore nel db'));
            }
        } else{
            return json_encode(array("Inserisci tutti i campi del form"));
        }
    }
}