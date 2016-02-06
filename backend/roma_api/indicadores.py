#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

mongo_ip = '127.0.0.1'
#mongo_ip = 'roma.mett.com.co'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/indicadores', method='GET')
def lista_indicadores():
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    indicadores_dict = {}
    cursor = db.indicadores.find({}, {'_id': False, 'id': True, 'nombre': True})
    for indicador in cursor:
        indicadores_dict[indicador['id']] = indicador
        
    return indicadores_dict

@route('/api/v1/indicadores/<id_indicador>', method='GET')
def detalle_indicador(id_indicador):
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    valores_indicador = {}
    cursor = db.indicadores.find({'id': int(id_indicador)},{'_id': False, 'municipios': True})
    for indicador in cursor:
        valores_indicador = indicador
        
    return valores_indicador
