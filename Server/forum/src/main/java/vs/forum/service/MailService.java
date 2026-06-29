package vs.forum.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MailService {

	private final JavaMailSender javaMailSender;

	@Value("${spring.mail.username}")
	private String from;

	public boolean sendVerificationSuccessEmail(String email, String username, String password) {
		boolean sent = false;
		SimpleMailMessage smm = new SimpleMailMessage();
		smm.setFrom(from);
		smm.setTo(email);
		String title = "Forum - verifikacija naloga";
		smm.setSubject(title);
		String tekst = "Dragi/a " + username + "\n\n"
				+ "Dobrodošli u našu zajednicu! Zahvaljujemo Vam se što ste se pridružili našem forumu." + "\n"
				+ "Želimo Vam ugodno iskustvo na našem sajtu i radujemo se Vašem doprinosu zajednici." + "\n\n"
				+ (password != null
						? "Vaša automatski generisana lozinka je: \t" + password + "\n"
								+ "Poželjno bi bilo da je promijenite u okviru svog profila." + "\n\n"
						: "")
				+ "Sa poštovanjem," + "\n" + "\tInternet Forum.";
		smm.setText(tekst);
		try {
			javaMailSender.send(smm);
			sent = true;
		} catch (MailException ex) {
			sent = false;
		}
		return sent;
	}

	public boolean sendVerificationCode(String email, String verificationCode) {
		boolean poslato = false;
		SimpleMailMessage smm = new SimpleMailMessage();
		smm.setFrom(from);
		smm.setTo(email);
		String naslov = "Internet Forum - aktivacija naloga";
		smm.setSubject(naslov);
		String tekst = "Verifikacioni kod: " + verificationCode;
		smm.setText(tekst);

		try {
			javaMailSender.send(smm);
			poslato = true;
		} catch (MailException ex) {
			poslato = false;
		}
		return poslato;
	}

}
