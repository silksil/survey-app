// SurveyForm shows a form for a user to add input
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import formFields from './formFields';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';

class SurveyForm extends Component {
  renderFields() {
    return formFields.map(field => {
      return (
        <Field key={field.name} component={SurveyField} type="text" label={field.label} name={field.name} />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  formFields.forEach(field => {
    if (!values[field.name]) {
      errors[field.name] = field.noValueError;
    }
  });

  errors.recipients = validateEmails(values.recipients || '');

  return errors;
}

// destroyOnUnmount to false so we can access the form in SurveyFormReview
export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);
