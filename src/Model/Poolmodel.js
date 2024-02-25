class Pool {
  constructor(title, description, stdate, enddate, type, sponsorImage1, sponsorImage2, emails, Adminid, Competition_cat, Competition_name,  Competition_logo) {
    this.title = title;
    this.description = description;
    this.stdate = stdate;
    this.enddate = enddate;
    this.type = type;
    this.sponsorImage1 = sponsorImage1;
    this.sponsorImage2 = sponsorImage2;
    this.emails = emails;
    this.Adminid = Adminid;
    this.Competition_cat =Competition_cat;
    this.Competition_name = Competition_name;
    this.Competition_logo = Competition_logo;
  }

  toPlainObject() {
    return {
      title: this.title,
      description: this.description,
      stdate: this.stdate,
      enddate: this.enddate,
      type: this.type,
      sponsorImage1: this.sponsorImage1,
      sponsorImage2: this.sponsorImage2,
      emails: this.emails,
      Adminid: this.Adminid,
      Competition_cat: this. Competition_cat,
      Competition_name: this.Competition_name,
      Competition_logo: this.Competition_logo
    };
  }
}




export default Pool;
