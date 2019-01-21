import React from 'react';
import {Component} from 'react';
import {HashRouter, Route, NavLink, BrowserRouter as Router, Link, Switch, Redirect} from 'react-router-dom';
import AdminRoute from './AdminRoute';
import EmployeeRoute from './EmployeeRoute';
import CompanyRoute from './CompanyRoute';
import UserRoute from './UserRoute';
import NonLoggedInRoute from './NonLoggedInRoute';

import {Divider} from 'semantic-ui-react';

import {
    HomePage,
    AdminUsersPage,
    AdminEditUserPage,
    AdminCompanyPage,
    AdminCategoriesPage,
    AdminEditCategoryPage,
    EmployeeManageTicketsPage,
    EmployeePublishTicketPage,
    EmployeeManageNewsPage,
    EmployeeEditNewscasePage,
    EmployeeManageAssignmentsPage,
    EmployeeEditAssignmentPage,
    EntrepreneurAssignmentPage,
    UserPage,
    UserReportTicketPage,
    UserNewsFeedPage,
    UserTicketsPage,
    UserSubscriptionPage,
    RegisterPage,
    LoginPage,
    LogoutPage,
    PageNotFoundPage,
    AccessDeniedPage
} from './pages/files';

//Edit MyWidget inside curlybrackets and in the file link.
import {MapWidget as Widget} from './widgets/MapWidget';

export class AppRouter extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    {/* Admin Routes */}
                    <AdminRoute exact path="/admin/users" component={AdminUsersPage}/>
                    <AdminRoute exact path="/admin/company" component={AdminCompanyPage}/>
                    <AdminRoute exact path="/admin/users/:userid/edit" component={AdminEditUserPage}/>
                    <AdminRoute exact path="/admin/categories" component={AdminCategoriesPage}/>
                    <AdminRoute exact path="/admin/categories/:categoryid/edit" component={AdminEditCategoryPage}/>
                    {/* Employee */}
                    <EmployeeRoute exact path="/employee/tickets" component={EmployeeManageTicketsPage}/>
                    <EmployeeRoute exact path="/employee/publish/:ticketid" component={EmployeePublishTicketPage}/>
                    <EmployeeRoute exact path="/employee/news" component={EmployeeManageNewsPage}/>
                    <EmployeeRoute exact path="/employee/news/:newscaseid/edit" component={EmployeeEditNewscasePage}/>
                    <EmployeeRoute exact path="/employee/assignments" component={EmployeeManageAssignmentsPage}/>
                    <EmployeeRoute exact path="/employee/assignments/:assignmentid/edit"
                                   component={EmployeeEditAssignmentPage}/>
                    {/* Entrepreneur */}
                    <CompanyRoute exact path="/assignments" component={EntrepreneurAssignmentPage}/>
                    {/* Normal User */}
                    <UserRoute exact path="/profile" component={UserPage}/>
                    <UserRoute exact path="/report" component={UserReportTicketPage}/>
                    <UserRoute exact path="/feed" component={UserNewsFeedPage}/>
                    <UserRoute exact path="/tickets" component={UserTicketsPage}/>
                    <UserRoute exact path="/tickets/:ticketid/edit" component={UserTicketsPage}/>
                    <UserRoute exact path="/subscriptions" component={UserSubscriptionPage}/>
                    {/* Others */}
                    <NonLoggedInRoute exact path="/register" component={RegisterPage}/>
                    <NonLoggedInRoute exact path="/login" component={LoginPage}/>
                    <Route exact path="/logout" component={LogoutPage}/>
                    <Route exact path="/404" component={PageNotFoundPage}/>
                    <Route exact path="/403" component={AccessDeniedPage}/>
                    <Route component={PageNotFoundPage}/>

                    {/* Develoopment */}
                    <Route exact path="/widget" component={Widget}/>
                </Switch>
            </>
        );
    }
}
