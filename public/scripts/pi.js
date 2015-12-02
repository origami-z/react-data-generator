var PIDialog = React.createClass({
  loadDataFromServer: function(){
    //console.log(this.props.url);

    $.getJSON(this.props.url, function(data, status){
      ///TODO: change the state for pause updating when unconnected
      this.setState({data: data});
    }.bind(this));
  },
  getInitialState: function() {
    return {data: {"cmm":{"connected":false,"tracking":{"point":{"x":42.268,"y":-57.21,"z":185.058},"vector":{"i":-0,"j":-0,"k":1}}},"commands":{"list":[]}}};
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return true; //return this.state.data.cmm.connected;
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  },
  render: function() {
    var dialog;
    if (this.state.data.cmm.connected)
    {
      dialog = <PITrackingDialog tracking={this.state.data.cmm.tracking} />;
    }

    return (
      <div id="PIDialog">
        <h1>Hellooo</h1>
        <PICommandList commands={this.state.data.commands}/>
        {dialog}
      </div>
    );
  }
});

var PICommandList = React.createClass({
  render: function() {
    // console.log(this.props.data);
    var CommandButtons = this.props.commands.list.map(function(command, i) {
      return (
        <PICommandButton key={i} command={command}/>
      );
    });
    return (
      <div id="PICommandList">
        {CommandButtons}
      </div>
    );
  }
});

var PICommandButton = React.createClass({
  sendCommandToServer: function() {
    $.post("http://localhost:8080/powerinspect/commands/" + this.props.command.name, function(data, status){
    });
  },
  render: function() {
    return (
      <button className="btn btn-primary" onClick={this.sendCommandToServer} disabled={!this.props.command.enabled}>{this.props.command.name}</button>
    );
  }
});

var PITrackingDialog = React.createClass({
  getInitialState: function() {
    return {isShowOrientationChecked: false};
  },
  checkChange: function(event) {
    console.log(event.target.checked);
    this.setState({isShowOrientationChecked: event.target.checked});
  },
  render: function() {


    var displayData;

    console.log(this.state.isShowOrientationChecked);
    if (this.state.isShowOrientationChecked) {
      displayData = $.extend(this.props.tracking.point,this.props.tracking.vector);
    } else {
      console.log(this.props.tracking);
      displayData = this.props.tracking.point;
    }
    
    return (
      <div id="PITrackingDialog">
        <h3>Tracking Data</h3>
        <p>Show <code>i,j,k</code> <input type="checkbox" checked={this.state.isShowOrientationChecked} onChange={this.checkChange} aria-label="Toggle"/></p>
        <PITrackingTable data={displayData}/>
      </div>
    );
  }
});

var PITrackingTable = React.createClass({
  render: function() {
  
    console.log(this.props.data);

    var rows = [];
    for(var key in this.props.data){
      rows.push(<tr key={key}><td>{key}</td><td>{this.props.data[key]}</td></tr>);
    }
    console.log(rows);

    var clsName= "table table-striped col-xs-12 col-md-6";
    
    return (
      <table className={clsName}>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

ReactDOM.render(
  <PIDialog url="http://localhost:8080/powerinspect/status" pollInterval={100} />,
  document.getElementById('content')
);