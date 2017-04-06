package untappedBreweryProject;
//author Thomas Nascenzi
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;
@Path("/frontpage")
public class FrontPage {

	@GET
	@Produces("text/html")
	public String convertFtoC() throws JSONException {



		String result = "<html>"
				+ "<link rel=\"stylesheet\" href=\"/untappedBreweryProject/bootstrap/css/bootstrap.css\" type=\"text/css\">"
				+ navBar() +
				"<body><h2>Hello World!</h2></body></html>";
		return result;
	}
	public String navBar() {
		String result = "<nav class=\"navbar navbar-toggleable-md navbar-light bg-faded\">"
				+ "<button class=\"navbar-toggler navbar-toggler-right\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNavAltMarkup\" aria-controls=\"navbarNavAltMarkup\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">"
				+ "<span class=\"navbar-toggler-icon\"></span>"
				+ "</button>"
				+ "<a class=\"navbar-brand\" href=\"#\">Navbar</a>"
				+ "<div class=\"collapse navbar-collapse\" id=\"navbarNavAltMarkup\">"
				+ "<div class=\"navbar-nav\">"
				+ "<a class=\"nav-item nav-link active\" href=\"#\">Home <span class=\"sr-only\">(current)</span></a>"
				+ "<a class=\"nav-item nav-link\" href=\"#\">Features</a>"
				+ "<a class=\"nav-item nav-link\" href=\"#\">Pricing</a>"
				+ "<a class=\"nav-item nav-link disabled\" href=\"#\">Disabled</a>"
				+ "</div>"
				+ "</div>"
				+ "</nav>";
		return result;
	}

}
