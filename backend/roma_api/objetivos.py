#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

mongo_ip = 'roma.mett.com.co'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/objetivos', method='GET')
def lista_objetivos():
	return 'lista objetivos'

@route('/api/v1/objetivos/<id_objetivo>', method='GET')
def detalle_objetivo(id_objetivo):
	return 'data.region.*ods - ' + id_objetivo
