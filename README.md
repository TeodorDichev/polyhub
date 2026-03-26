# PolyHub

_Developed by: Teodor Dichev 7MI0600424, Georgi Stoyanov 6MI0600497_

PolyHub is web application inspired by the need of a common place in the internet for neutral political assesment and where all parties in Bulgaria will share their plans and programs. With the new upcoming elections and rising interest in the youth such software is becoming more and more needed. For instance, take a look at this tool which gained massive popularity: [stazha](https://poltest.strazha.bg/).

The application will be developed using maven as a build tool and these techonologies:

*   Java (Spring boot)
    
*   PostgreSQL
    
*   Angular and Bootstrap.
    

We aim to create a RESTfull service with layerd architecture as a MVP and maybe move to SOA in the future. If there is enough time we will add:

*   Unit tests with Junit and Mockito
    
*   CI/CD pipelines like running tests after each commit
    
*   Spring Boot security
    
*   Containers and deploying the application using AWS services
    

Lets take a deeper look into the structure of the application.

## Roles and entities

Before taking a look at the database let’s discuss what roles and entities we will have.

*   Users: We have three types of users:
    
    1.  PartyAdmin: they can login/logout/register, they are responsible for creating a party, adding the party members (party members are not users), managing the program. Everyone can create a profile, however to create a party you need approval. The best option will be to integrate the needed info for approval into a form which can be filled and send to our admins, however due to time limitations and that there are not really a lot of parties the needed info should be sent via email which we will provide.
        
    2.  PolyHubAdmin: they are seeded into the database and can add other admins and poly-specialists. They can approve or reject creating a party. They operate through a special dashboard.
        
    3.  PolyHubSpecialist: they add new election. They are politologists and experts and they job is to grade each political party, its policies and its program on the political compas.
        
*   Parties: they have members which can be added by party admins. For each election parties can have a different program with different policies. We think to integrate a simple text editor into the application and an option to use the last program for this election. Parties can self determine where they stand on the political compas but our PolyHub experts will also asses them.
    
*   Programs: they have policies (like tags) and a lot of text. As we said programs can be different for each election and have different priorities and politics. The party admin can create them.
    
*   Elections: added by our experts whenever their is a new election. Visualized with a new section and parties can add their programs for it. Can have policies and also should be placed on our political compas.

*   Policies: simple tags related to each programs. Their idea is to visualize the main goals of a program/party.
    
_Note that everyone can visit the page and take a look at the parties, their members and their programs for this or for any previous election. This is the main goal of our product to provide bulgarians with easy access to all political parties, their programs and their goals. Of course they cannot edit anything, neither leave comments or likes. Therefore for them our web application will be more like a blog or a news article._

## Database

For our datastore we have chosen traditional relational database.

![](./media/polyhub_erd.png)

## Endpoints

We will provide our endpoints on a github-page. If you have postman try checking them out by opening this link with the application: [endpoints](https://teo-424459.postman.co/workspace/Teo's-Workspace~9ea87044-5372-4b12-8e57-888d2bb6697c/collection/45317997-123122e5-2fe3-42fd-84a0-59f7c58400d8?action=share&source=copy-link&creator=45317997)