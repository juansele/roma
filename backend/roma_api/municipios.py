#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

mongo_ip = 'roma.mett.com.co'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/municipios', method='GET')
def lista_municipios():
	return 'lista municipios'

@route('/api/v1/municipios/<id_municipio>', method='GET')
def detalle_municipio(id_municipio):
	return 'data.municipio - ' + id_municipio
