#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

mongo_ip = 'roma.mett.com.co'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/indicadores', method='GET')
def lista_indicadores():
	return 'lista indicadores'

@route('/api/v1/indicadores/<id_indicador>', method='GET')
def detalle_indicador(id_indicador):
        return 'data.region.indicador - ' + id_indicador
