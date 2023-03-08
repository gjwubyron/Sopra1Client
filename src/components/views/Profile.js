import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Profile = () => {
    const { id } = useParams()

    const history = useHistory();
    const [user, setUser] = useState(null);

    const edit = () => {
        localStorage.setItem('id', id)
        history.push('/edit/' + id);
      }

    const exit = () => {
            history.push('/game');
          }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
          try {
            const token = localStorage.getItem('token')
            const response = await api.get('/users/'+ id + '?' + new URLSearchParams({'token' : token} ));

            // delays continuous execution of an async operation for 1 second.
            // This is just a fake async call, so that the spinner can be displayed
            // feel free to remove it :)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            setUser(response.data);

            // This is just some data for you to see what is available.
            // Feel free to remove it.
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
          } catch (error) {
            console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the profile! See the console for details.");
          }
        }
          fetchData();
          }, [id]);

    let content = <Spinner/>;

      if (user) {
        content = (
          <div className="game">
            <ul className="game paragraph">
            <div className="player id">Username:{user.username}</div>
            <div className="player id">Status: {user.status}</div>
            <div className="player id">creation_date:{user.creation_date}</div>
            <div className="player id">Birthday: {user.birthday}</div>
            </ul>

            <Button
               width="50%"
               onClick={() => exit()}
            >
              Exit
            </Button>
            <Button
               disabled={ localStorage.getItem('token') !==  user.token}
               width="50%"
               onClick={() => edit()}
            >
               Edit
            </Button>
          </div>
        );
      }
    return (
        <BaseContainer className="game container">
          <h2>Profile page</h2>
          {content}
        </BaseContainer>
      );
}

export default Profile;