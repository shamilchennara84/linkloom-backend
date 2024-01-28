import { ISendOTP } from "../interfaces/sendMail";
import nodemailer from "nodemailer";

export class MailSender implements ISendOTP {
 
  sendOTP(email: string, name: string, otp: number): void {
    const mailData = `
       <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		.menu_block.desktop_hide .menu-links span {
			mso-hide: all;
		}

		#memu-r0c1m1:checked~.menu-links {
			background-color: #5855bd !important;
		}

		#memu-r0c1m1:checked~.menu-links a,
		#memu-r0c1m1:checked~.menu-links span {
			color: #ffffff !important;
		}

		@media (max-width:690px) {
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.menu-checkbox[type=checkbox]~.menu-links {
				display: none !important;
				padding: 5px 0;
			}

			.menu-checkbox[type=checkbox]:checked~.menu-trigger .menu-open {
				display: none !important;
			}

			.menu-checkbox[type=checkbox]:checked~.menu-links,
			.menu-checkbox[type=checkbox]~.menu-trigger {
				display: block !important;
				max-width: none !important;
				max-height: none !important;
				font-size: inherit !important;
			}

			.menu-checkbox[type=checkbox]~.menu-links>a,
			.menu-checkbox[type=checkbox]~.menu-links>span.label {
				display: block !important;
				text-align: center;
			}

			.menu-checkbox[type=checkbox]:checked~.menu-trigger .menu-close {
				display: block !important;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-2 .column-1 .block-3.paragraph_block td.pad>div {
				font-size: 35px !important;
			}
		}
	</style>
</head>

<body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000;">
						<tbody>
							<tr>
								<td>
									<table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 670px; margin: 0 auto;" width="670">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1 mobile_hide" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-left:25px;padding-top:15px;width:100%;padding-right:0px;">
																<div class="alignment" align="left" style="line-height:10px">
																	<div style="max-width: 184px;"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1132432_1118016/logo-no-background.png" style="display: block; height: auto; border: 0; width: 100%;" width="184" alt="Alternate text" title="Alternate text"></div>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
													<table class="menu_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="color:#fefefe;font-family:inherit;font-size:16px;padding-right:20px;text-align:right;">
																<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td class="alignment" style="text-align:right;font-size:0px;"><!--[if !mso]><!--><input class="menu-checkbox" id="memu-r0c1m1" type="checkbox" style="display:none !important;max-height:0;visibility:hidden;"><!--<![endif]-->
																			<div class="menu-trigger" style="display:none;max-height:0px;max-width:0px;font-size:0px;overflow:hidden;"><label class="menu-label" for="memu-r0c1m1" style="height: 36px; width: 36px; display: inline-block; cursor: pointer; mso-hide: all; user-select: none; align: right; text-align: center; color: #ffffff; text-decoration: none; background-color: #5855bd; border-radius: 0;"><span class="menu-open" style="mso-hide:all;font-size:26px;line-height:31.5px;">☰</span><span class="menu-close" style="display:none;mso-hide:all;font-size:26px;line-height:36px;">✕</span></label></div>
																			<div class="menu-links"><!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style=""><tr style="text-align:right;"><![endif]--><!--[if mso]><td style="padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:15px"><![endif]--><span class="label" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:20px;display:inline;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;color:false;letter-spacing:normal;">Log In</span><!--[if mso]></td><![endif]--><!--[if mso]><td style="padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:15px"><![endif]--><span class="label" style="mso-hide:false;padding-top:5px;padding-bottom:5px;padding-left:15px;padding-right:20px;display:inline;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;color:false;letter-spacing:normal;">Signup</span><!--[if mso]></td><![endif]--><!--[if mso]></tr></table><![endif]--></div>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-3" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; background-position: top center; color: #000000; width: 670px; margin: 0 auto;" width="670">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:25px;padding-right:10px;padding-top:10px;">
																<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
																	<p style="margin: 0; word-break: break-word;">Hi ${name},</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:25px;padding-right:25px;padding-top:10px;">
																<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:46px;line-height:120%;text-align:left;mso-line-height-alt:55.199999999999996px;">
																	<p style="margin: 0; word-break: break-word;"><strong><span>Welcome Aboard!</span></strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:25px;padding-left:25px;padding-right:25px;padding-top:10px;">
																<div style="color:#ffffff;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:150%;text-align:left;mso-line-height-alt:21px;">
																	<p style="margin: 0; word-break: break-word;">Welcome to LinkLoom, where connections come to life! Your one-time password (OTP) for verification is:</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
																<div class="alignment" align="left"><!--[if mso]>
																			<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:52px;width:190px;v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#ed0b51">
																			<w:anchorlock/>
																			<v:textbox inset="5px,0px,0px,0px">
																			<center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px">
																			<![endif]-->
																	<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#ed0b51;border-radius:4px;width:auto;border-top:0px solid #8a3b8f;font-weight:undefined;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:10px;padding-bottom:10px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:50px;padding-right:45px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;"><strong>${otp}</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-2 mobile_hide" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-3 mobile_hide" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
													<table class="image_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-right:5px;width:100%;">
																<div class="alignment" align="center" style="line-height:10px">
																	<div style="max-width: 330px;"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1132432_1118016/_Pngtree_modern_flat_design_of_social_4157749-removebg-preview.png" style="display: block; height: auto; border: 0; width: 100%;" width="330" alt="Alternate text" title="Alternate text"></div>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: 0 solid #000000; border-left: 0 solid #000000; border-right: 0px solid #000000; border-top: 0 solid #000000; color: #000000; width: 670px; margin: 0 auto;" width="670">
										<tbody>
											<tr>
												<td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;">
																<div style="color:#000000;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
																	<p style="margin: 0; word-break: break-word;"><strong>Links</strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;">
																<div style="color:#120606;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:180%;text-align:left;mso-line-height-alt:25.2px;">
																	<p style="margin: 0; word-break: break-word;"><a style="text-decoration: none; color: #000000;" href="#" target="_blank" rel="noopener">Latest Job</a></p>
																	<p style="margin: 0; word-break: break-word;"><a style="text-decoration: none; color: #000000;" href="#" target="_blank" rel="noopener">Help Center</a></p>
																	<p style="margin: 0; word-break: break-word;"><a style="text-decoration: none; color: #000000;" href="#" target="_blank" rel="noopener">Tour Guide</a></p>
																	<p style="margin: 0; word-break: break-word;"><a style="text-decoration: none; color: #000000;" href="#" target="_blank" rel="noopener">FAQ's</a></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#000000;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
																	<p style="margin: 0; word-break: break-word;"><strong>Contact Info</strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#050505;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:180%;text-align:left;mso-line-height-alt:25.2px;">
																	<p style="margin: 0; word-break: break-word;">IND +91 701 20 56612<br>IND +91 8138047980</p>
																	<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																	<p style="margin: 0; word-break: break-word;">&nbsp;</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#000000;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
																	<p style="margin: 0; word-break: break-word;"><strong>LinkLoom</strong></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad">
																<div style="color:#050505;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:14px;line-height:180%;text-align:left;mso-line-height-alt:25.2px;">
																	<p style="margin: 0; word-break: break-word;">LinkLoom is more than just a social media platform; it's a hub for meaningful connections and vibrant communities</p>
																</div>
															</td>
														</tr>
													</table>
													<table class="social_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="left">
																	<table class="social-table" width="144px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																		<tr>
																			<td style="padding:0 4px 0 0;"><a href="https://www.facebook.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-black/facebook@2x.png" width="32" height="32" alt="Facebook" title="Facebook" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 4px 0 0;"><a href="https://www.twitter.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/twitter@2x.png" width="32" height="32" alt="Twitter" title="Twitter" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 4px 0 0;"><a href="https://www.instagram.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/instagram@2x.png" width="32" height="32" alt="Instagram" title="Instagram" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 4px 0 0;"><a href="https://www.linkedin.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/linkedin@2x.png" width="32" height="32" alt="LinkedIn" title="LinkedIn" style="display: block; height: auto; border: 0;"></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 670px; margin: 0 auto;" width="670">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
    `;

    const mailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const details = {
      from: process.env.EMAIL,
      to: email,
      subject: "One-Time Password (Derby Dome)",
      html: mailData,
    };

    mailTransporter.sendMail(details, (err: Error | null) => {
		console.log("mail sent");
      if (err) {
        console.log(err.message);
      }
    });
  }
}
