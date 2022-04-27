import React from 'react';
import Loader from 'components/LayoutComponents/Loader';

class MenuList extends React.Component {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
  };


  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <>
        <p>Here we go Here we go Here we go again...</p>
      </>
    );
  }
}

export default MenuList;
