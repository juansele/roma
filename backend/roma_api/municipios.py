#!/usr/bin/python
from bottle import route, request, response
import pymongo
from bson.objectid import ObjectId

#mongo_ip = 'roma.mett.com.co'
mongo_ip = '127.0.0.1'
mongo_port = 27017
mongo_db = 'roma'

@route('/api/v1/municipios', method='GET')
def lista_municipios():
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    municipios_dict = {}
    cursor = db.municipios.find({}, {'_id': False, 'id': True, 'nombre': True})
    for municipio in cursor:
        municipios_dict[municipio['id']] = municipio
        
    return municipios_dict
    
@route('/api/v1/municipios.geojson', method='GET')
def geojson_municipios():
    db = pymongo.MongoClient(mongo_ip, mongo_port)[mongo_db]

    municipios_array = []
    cursor = db.municipios.find({}, {'_id': False, 'id': True, 'nombre': True, 'geometry': True})
    for municipio in cursor:
        item = {'type': 'Feature'}
        # arreglalo una vez en mongo
        for index, coordinate in enumerate(municipio['geometry']['coordinates'][0]):
            municipio['geometry']['coordinates'][0][index] = [round(coordinate[0],5), round(coordinate[1],5)]
        item['geometry'] = municipio['geometry']
        item['properties'] = {'id': municipio['id'], 'nombre': municipio['nombre']}
        municipios_array.append(item)
        
    return ({'municipios': municipios_array})

@route('/api/v1/municipios/<id_municipio>', method='GET')
def detalle_municipio(id_municipio):
    return 'data.municipio - ' + id_municipio