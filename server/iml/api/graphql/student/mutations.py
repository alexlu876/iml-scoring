import graphene


class StudentAttribute():
    first = graphene.String(description = "First Name")
    last = graphene.String(description = "Last Name")
    nickname = graphene.String(description = "Nickname" required=False)
    graduationYear = graphene.String(description = "Graduation Year")

