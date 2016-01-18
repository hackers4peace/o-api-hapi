import Boom from 'boom'
import { promises as jsonld } from 'jsonld'

class Handlers {
  /**
   * @param {Storage} storage
   * @param {Object} config
   */
  constructor(storage, config) {
    this.storage = storage
    this.config = config
  }

  // TODO support content negotiation JSON-LD, Turtle
  get (request, reply) {
    var uri = this.config.baseUri + request.params.all
    this.storage.get(uri)
    .then((doc) => {
      return jsonld.fromRDF(doc, { format: 'application/nquads' })
    }).then((expanded) => {
      return reply(expanded)
    }).catch((err) => {
      reply(Boom.badImplementation())
    })
  }
}

export { Handlers as default }
