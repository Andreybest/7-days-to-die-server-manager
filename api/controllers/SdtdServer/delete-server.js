module.exports = {

  friendlyName: 'Delete server',

  description: 'Delete a server from the system',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/delete'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    },
    notLoggedIn: {
      responseType: 'badRequest',
      description: 'User is not logged in (check signedCookies)'
    }
  },

  /**
   * @memberof SdtdServer
   * @name delete
   * @description Deletes a server from the system
   * @param {number} serverID ID of the server
   */

  fn: async function (inputs, exits) {

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn';
    }

    sails.log.debug(`VIEW - SdtdServer:delete - Deleting server ${inputs.serverId}`);

    try {
      let server = await SdtdServer.findOne(inputs.serverId)
      if (_.isUndefined(server)) {
        return exits.notFound();
      }
    
      // TODO: delete web tokens from server

      sails.hooks.sdtdlogs.stop(server.id)

      SdtdServer.destroy({id: server.id})
      exits.success()

    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:delete - ${error}`);
      exits.error(error)
    }


  }
};