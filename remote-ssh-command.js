function  getRemoteSSHConnection() {
    var remoteConnectionSvc = Components.classes["@activestate.com/koRemoteConnectionService;1"].
            getService(Components.interfaces.koIRemoteConnectionService);
    // Use the current file's URI.
    var view = ko.views.manager.currentView;
    var uri = view.document && view.document.file.URI || view.koDoc.file.URI; // Support K7 koDoc
    if (uri.substr(0, 1) != "s") {
        throw Error("The current file is not a remote SSH file. Open a remote file first.");
    }
    var conn = remoteConnectionSvc.getConnectionUsingUri(uri);
    if (conn) {
        // Ensure it's an SSH connection
        conn.QueryInterface(Components.interfaces.koISSHConnection);
    }
    else
    {
        throw Error("Not an SSH connection.  Please open the file through SSH.");
    }
    return conn
}
var conn = getRemoteSSHConnection();
var stdout = {};
var stderr = {};
var retval = conn.runCommand("ls -la", false, stdout, stderr);

ko.notifications.add('Remote Run Command',
                     ['Remote Command', "Macro Monday"],
                     'remote_run_command',
                     { severity : Components.interfaces.koINotification.SEVERITY_INFO, description : stdout.value });
