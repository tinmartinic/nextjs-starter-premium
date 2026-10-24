interface EmailTemplateProps {
  confirmationLink: string;
}

export const EmailTemplate = ({ confirmationLink }: EmailTemplateProps) => (
  <div>
    <h1>Welcome!</h1>
    <p>
      Please click the following link to confirm your email:{' '}
      <a href={confirmationLink}>{confirmationLink}</a>
    </p>
  </div>
);
