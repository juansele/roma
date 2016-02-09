#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

mongo_ip = '127.0.0.1'
#mongo_ip = 'roma.mett.com.co'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/objetivos', method='GET')
def lista_objetivos():
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    objetivos_dict = {}
    cursor = db.objetivos.find({}, {'_id': False, 'id': True, 'nombre': True})
    for objetivo in cursor:
        objetivos_dict[objetivo['id']] = objetivo
        
    return objetivos_dict

@route('/api/v1/objetivos/<id_objetivo>', method='GET')
def detalle_objetivo(id_objetivo):
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    valores_objetivo = {}
    cursor = db.objetivos.find({'id': int(id_objetivo)},{'_id': False, 'municipios': True, 'color': True})
    for objetivo in cursor:
        valores_objetivo = objetivo
        
    return valores_objetivo

