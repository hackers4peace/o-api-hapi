import Boom from 'boom'
import Dataset from 'o-utils-dataset'
import JsonldSerializer from 'rdf-serializer-jsonld'
import JsonldParser from 'rdf-parser-jsonld'

const parsers = {
  jsonld: new JsonldParser()
}

const serializers = {
  jsonld: new JsonldSerializer()
}

class Handlers {
  /**
   * @param {Storage} storage
   * @param {Object} config
   */
  constructor(storage, config) {
    this.dataset = new Dataset(storage)
    this.config = config
  }

  // TODO support content negotiation JSON-LD, Turtle
  get (request, reply) {
    var uri = this.config.baseUri + request.params.all
    this.dataset.getResource(uri)
      .then((graph) => {
        return serializers.jsonld.serialize(graph)
      }).then((json) => {
        return reply(json)
      }).catch((err) => {
        console.log(err)
        reply(Boom.badImplementation())
      })
  }

  add (request, reply) {
    let uri = this.config.baseUri + request.params.all
    parsers.jsonld.parse(request.payload)
      .then((graph) => {
        return this.dataset.createResource(request.payload['@id'].replace('#id', ''), graph)
      }).then((resourceUri) => {
        return this.dataset.addMemberToContainer(uri, resourceUri)
      }).then((containerUri) => {
        return reply(request.payload)
      }).catch((err) => {
        console.log(err)
        reply(Boom.badImplementation())
      })
  }
}

export { Handlers as default }
