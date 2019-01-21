import React from 'react';
import { Component } from 'react';
import { Grid, Segment, List, Icon } from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';

export class AdminCategoriesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [],
      subCategories: []
    };
  }

  getSubCategory(mainCatId) {
    return categoryService.getSubCategories(mainCatId).then(subCats => {
      return subCats;
    });
  }

  componentWillMount() {
    categoryService.getCategories().then(res => {
      this.state.mainCategories = res.data;
      res.data.map(mainCat => {
        this.getSubCategory(mainCat.id);
      });
    });
    console.log(this.state.subCategories, 'fewf');
  }

  render() {
    return (
      <div>
        <Grid columns="equal">
          <Grid.Column width={6}>
            <Segment>
              <List divided relaxed>
                {console.log(this.state.subCategories)}
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI</List.Header>
                    <List.Description as="a">Updated 10 mins ago</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI-Docs</List.Header>
                    <List.Description as="a">Updated 22 mins ago</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI-Meteor</List.Header>
                    <List.Description as="a">Updated 34 mins ago</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <List divided relaxed>
                {console.log(this.state.subCategories)}
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI</List.Header>
                    <List.Description as="a">Updated 10 mins ago</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI-Docs</List.Header>
                    <List.Description as="a">Updated 22 mins ago</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="github" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Semantic-Org/Semantic-UI-Meteor</List.Header>
                    <List.Description as="a">Updated 34 mins ago</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
