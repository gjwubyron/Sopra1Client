import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const Edit = props => {
  const { id } = useParams()
  const history = useHistory();
  const [birthday, setBirthday] = useState(null);
  const [username, setUsername] = useState(null);
  const dateReg = /^\d{4}-\d{2}-\d{2}$/

  const doUpdate = async () => {
    try {
        if(birthday){
           if(!birthday.match(dateReg)){
           throw new Error("Incorrect format for birthday YYYY-MM-DD" + birthday);
           }
        }
      const requestBody = JSON.stringify({username, birthday});
      const token = localStorage.getItem('token')
      await api.put('/users/'+ id + '?' + new URLSearchParams({'token' : token} ), requestBody);

      history.push(`/profile/` + id);
    } catch (error) {
      alert(`Something went wrong during the updating: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Birthday"
            value={birthday}
            onChange={n => setBirthday(n)}
          />
          <div className="login button-container">
            <Button
             disabled={!username}
              width="100%"
              onClick={() => doUpdate()}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Edit;
