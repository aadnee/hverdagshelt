import React from 'react';
import { Component } from 'react';
import { Grid, Segment, List, Icon, Button } from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';

export class AdminCategoriesWidget extends Component {
  constructor(props) {
    super(props);

    this.selectMainCat = this.selectMainCat.bind(this);
    this.selectSubCat = this.selectSubCat.bind(this);

    this.state = {
      mainCategory: '',
      subCategory: '',
      categories: []
    };
  }

  selectSubCat = currentSubCat => {
    this.setState({ subCategory: currentSubCat });
    this.props.func(currentSubCat);
  };

  selectMainCat = currentCat => {
    this.setState({ mainCategory: currentCat, subCategory: '' });
    this.props.func(currentCat);
  };

  componentWillMount() {
    categoryService.getCategories().then(res => {
      this.setState({ categories: res.data });
    });
  }

  render() {
    return (
      <div>
        <Grid columns="equal">
          <Grid.Column width={6}>
            <Segment>
              <List divided relaxed size="large">
                {this.state.categories.map((mainCat, keyId) => (
                  <ListItemCategoriesWidget
                    func={this.selectMainCat.bind(this, mainCat)}
                    category={mainCat}
                    key={keyId}
                  />
                ))}
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <List divided relaxed size="large">
                {this.state.mainCategory
                  ? this.state.mainCategory.subs.map((subCat, keyId) => (
                      <ListItemCategoriesWidget
                        func={this.selectSubCat.bind(this, subCat)}
                        category={subCat}
                        key={keyId}
                      />
                    ))
                  : null}
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export class ListItemCategoriesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    return (
      <List.Item onClick={() => this.setState({ active: true })} active={true}>
        <List.Content>
          <Button inverted primary fluid onClick={this.props.func}>
            {this.props.category.name}
          </Button>
        </List.Content>
      </List.Item>
    );
  }
}
