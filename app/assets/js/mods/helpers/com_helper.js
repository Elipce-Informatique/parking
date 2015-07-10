var client = ({
    /**
     * Client send capabilities infos (contoller)
     * @returns {{messageType: string, data: {toto: string}}}
     */
    capabilities: function () {
        var retour = {
            messageType: 'capabilities',
            data: { }
        }
        return retour;
    }
});

module.exports = client;