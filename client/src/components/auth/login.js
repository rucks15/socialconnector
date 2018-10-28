import React, { Component } from 'react';
import classnames from 'classnames';
import {loginUser} from '../../actions/authActions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

 class Login extends Component {
  constructor(){
    //Calling parent class's constructor, here its 'Component'
    super();
    this.state = {
        email: '',
        password: '',
        errors : {}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
}
onChange(e){
    //[] means it is a derived value and not fixed
    this.setState({[e.target.name] : e.target.value });
}
onSubmit(e){
    e.preventDefault();
    const currentUser = {
        
        email:this.state.email,
        password:this.state.password
        
        
    };

    this.props.loginUser(currentUser, this.props.history);

    
}

componentWillReceiveProps(nextProps) {
  if(nextProps.errors){
    this.props.history.push('/dashboard');
  }
}
  render() {
    const {errors} = this.state;
    return (
      <div class="login">
    <div class="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your DevConnector account</p>
          <form action="dashboard.html">
            <div className="form-group">
              <input type="email" className={classnames('form-control form-control-lg',{'is-invalid':errors.name})} 
                  placeholder="Emailaddress" name="email" 
                  value={this.state.email}
                  onChange={this.onChange} />
              {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
            </div>
            <div className="form-group">
              <input type="password" className={classnames('form-control form-control-lg',{'is-invalid':errors.password})}
                   placeholder="Password" name="password"
                  value={this.state.password}
                  onChange={this.onChange} />
              {errors.name && (<div className="invalid-feedback">{errors.password}</div>)}
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
    )
  }
}

Login.propTypes = {
  loginUser : PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth : state.auth,
  errors : state.errors
})

export default connect(mapStateToProps ,{loginUser}) (Login);
