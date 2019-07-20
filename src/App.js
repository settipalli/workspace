import React from 'react';
import config from './config';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false
    };

    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.handleSignOutClick = this.handleSignOutClick.bind(this);

    this.initClient = this.initClient.bind(this); // bind required to access this.gapi
    this.updateSignInStatus = this.updateSignInStatus.bind(this); // bind required to access this.setState
    this.makeApiCall = this.makeApiCall.bind(this);
  }

  componentDidMount() {
    this.gapi = window.gapi;
    this.gapi.load('client:auth2', this.initClient);
  }

  render() {
    const isSignedIn = this.state.isSignedIn;
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Hello, Workspace</h1>
          <p className="subtitle">Manage your files.</p>
        </div>
        <div className="section">
          <div className="columns">
            <div className="field is-grouped">
              <div className="control">
                <button className={"button " + (isSignedIn ? "is-danger" : "is-link")} onClick={isSignedIn ? this.handleSignOutClick : this.handleSignInClick}>{isSignedIn ? 'Sign Out': 'Sign In'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
  }

  initClient() {
    // Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    this.gapi.client.init({
      'apiKey': config.API_KEY,
      'clientId': config.CLIENT_ID,
      'scope': SCOPE,
      'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
      this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
      this.updateSignInStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  handleSignInClick(event) {
    this.gapi.auth2.getAuthInstance().signIn();
  }

  handleSignOutClick(event) {
    this.gapi.auth2.getAuthInstance().signOut();
  }

  updateSignInStatus(isSignedIn) {
    this.setState((state) => ({
      isSignedIn: isSignedIn
    }));

    if (isSignedIn) {
      this.makeApiCall();
    }
  }

  makeApiCall() {
    var params = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: config.SPREADSHEET_ID,

      // The A1 notation of the values to retrieve.
      range: 'Monzo!A1:K2',

      // How values should be represented in the output.
      // The default render option is ValueRenderOption.FORMATTED_VALUE.
      // valueRenderOption: '',

      // How dates, times, and durations should be represented in the output.
      // This is ignored if value_render_option is
      // FORMATTED_VALUE.
      // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
      // dateTimeRenderOption: '',
    };

    var request = this.gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function (response) {
      console.log(response.result);
    }, function (reason) {
      console.error('error: ' + reason.result.error.message);
    });
  }

}

export default App;
